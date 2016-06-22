var readline = require('readline'),
  Promise = require('bluebird'),
  querystring = require('querystring'),
  request = require('request-promise'),
  dotenv = require('dotenv'),
  _ = require('lodash'),
  fs = Promise.promisifyAll(require('fs'));

require('dotenv').config();

var Api = require('scaleway'),
    client = new Api({token: process.env['SCALEWAY_TOKEN']});
Promise.promisifyAll(client);

function checkLogin() {
  return request({
    method: 'GET',
    uri:"https://account.scaleway.com/tokens",
    headers: {
      'X-AUTH-TOKEN': process.env['SCALEWAY_TOKEN']
    },
    json: true
  }).catch((error) => {
    return Promise.reject("Authentication Failed: " + error.error.message);
  });
}

checkLogin()
.then(() => {
  var data = {
    commercial_type: 'VC1S',
    image: '047f1372-3923-471f-82ca-5ff69dbaf0f7', // Ubuntu Xenial
    bootscript: 'b1777a5a-6d40-4d3d-8904-756b45efe370', // Docker
    organization: process.env['SCALEWAY_ORG']
  };

  var targetServers = [
    {
      tags: ['master', 'etcd'],
      name: "ostrich-master-1"
    },
    {
      tags: ['master', 'etcd'],
      name: "ostrich-master-2"
    },
    {
      tags: ['node', 'etcd'],
      name: "ostrich-node-1"
    },
    {
      tags: ['node'],
      name: "ostrich-node-2"
    }
  ];

  return Promise.map(targetServers, (server) => {
    server.tags.push('AUTHORIZED_KEY=' + process.env['SSH_PUBLIC_KEY']);
    var blueprint = _.extend({}, data, server);
    return client.postAsync('/servers', blueprint);
  });
}).then(function(resolved) {
  console.log(resolved);
  var servers = _.map(resolved, 'server');
  console.log(_.map(servers, 'public_ip'));
}, function(error) {
  console.log(error);
});
