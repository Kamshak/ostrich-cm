var readline = require('readline');
var Promise = require('bluebird');
var querystring = require('querystring');
var request = require('request-promise');
var fs = Promise.promisifyAll(require('fs'));

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.questionAsync = function(query) {
  return new Promise((resolve, reject) => {
    rl.question(query, resolve);
  });
}

function hidden(query, callback) {
    var stdin = process.openStdin();
    process.stdin.on("data", function(char) {
      char = char + "";
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004":
          stdin.pause();
          break;
        default:
          process.stdout.write("\033[2K\033[200D" + query + Array(rl.line.length+1).join("*"));
          break;
      }
    });

    return rl.questionAsync(query)
    .then(function(value) {
      rl.history = rl.history.slice(1);
      return value;
    });
}

var email, password;
rl.questionAsync("Email: ")
.then(function(_email) {
  email = _email;
}).then(function() {
  return hidden("Password : ");
}).then(function(_password) {
  password = _password;
  return request({
    method: 'POST',
    uri:"https://account.scaleway.com/tokens",
    body: {
      email: email,
      password: password
    },
    json: true,
  });
}).then(function(response) {
  console.log(`Your token: ${response.token.id}`);
  return fs.writeFileAsync('.env', `SCALEWAY_TOKEN=${response.token.id}`);
}).then(() => {
  console.log(".env has been configured to use it.");
}, (error) => {
  console.error("There was an error");
  console.log(error);
});
