require('babel/register')({
  stage: 0
});

require('colors');

var path = require('path');
var Bullet = require('./bullet');
var args = require('yargs').argv;

var directory = path.resolve(process.cwd(), args._[0]);
var bullet = new Bullet(directory, args);
bullet.run();


