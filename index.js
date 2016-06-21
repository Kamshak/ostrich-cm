var readline = require('readline'),
  Promise = require('bluebird'),
  querystring = require('querystring'),
  request = require('request-promise'),
  dotenv = require('dotenv'),
  fs = Promise.promisifyAll(require('fs'));

require('dotenv').config();

var Api = require('scaleway'),
    client = new Api({token: process.env['SCALEWAY_TOKEN']});

var data = {
  name: 'c1',
  organization: '<ORGANIZATION_ID>',
  image: '<IMAGE_ID>',
  tags: ['test', 'demo']
};

client.post('/servers', data, function(err, res) {
  console.log(res.server);
});
