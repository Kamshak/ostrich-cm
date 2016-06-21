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
  commercial_type: 'VC1S',
  organization: '<ORGANIZATION_ID>',
  image: '<IMAGE_ID>',
  tags: ['test', 'demo'],
  bootscript: ''
};

client.get('/bootscripts', {}, function(err, res) {
  console.log(err, res.body);
})
/*
client.post('/servers', data, function(err, res) {
  console.log(res.server);
});*/
