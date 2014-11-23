/**
 * Socket.io configuration
 */

'use strict';

var _ = require('lodash');
var config = require('./environment');
var mongoose = require('mongoose');
var Pi = require('../api/pi/pi.model');

var piSocket = [];
var userSocket = [];
// When the user disconnects.. perform this
function onDisconnect(socket) {

  if (socket["handshake"] && socket["handshake"]["query"] 
    && typeof socket["handshake"]["query"]["serial_number"] != 'undefined'
    && socket["handshake"]["query"]["serial_number"]) {
    
    var serialNumber = socket["handshake"]["query"]["serial_number"];

    delete piSocket[serialNumber];

    Pi.find({serial_number: serialNumber}, function (err, pis) {
      if (err) return console.info('err : ' + err);
      if (!pis) return console.info('not found pis');

      _.each(pis, function(pi) {

        if (userSocket[pi.user_id]) {
          userSocket[pi.user_id].emit('pi:offline', pi);
        }
        
      });
    });

    console.info('pi online: ' + _.keys(piSocket).length);
  } 

  if (socket["handshake"] && socket["handshake"]["query"] 
    && typeof socket["handshake"]["query"]["user_id"] != "undefined" 
    && socket["handshake"]["query"]["user_id"]) {

    delete userSocket[socket["handshake"]["query"]["user_id"]];
    
    console.info('user online: ' + _.keys(userSocket).length);
  } 

}

// When the user connects.. perform this
function onConnect(socket) {

  // console.log(socket.handshake.query);

  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    // console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  if (socket["handshake"] && socket["handshake"]["query"] 
    && typeof socket["handshake"]["query"]["serial_number"] != 'undefined'
    && socket["handshake"]["query"]["serial_number"]) {

    var serialNumber = socket["handshake"]["query"]["serial_number"];
    piSocket[serialNumber] = socket;

    Pi.find({serial_number: serialNumber}, function (err, pis) {
      if (err) return console.info('err : ' + err);
      if (!pis) return console.info('not found pis');

      _.each(pis, function(pi) {

        if (userSocket[pi.user_id]) {
          userSocket[pi.user_id].emit('pi:online', pi);
        }

      });
    });

    console.info('pi online: ' + _.keys(piSocket).length);
  } 

  if (socket["handshake"] && socket["handshake"]["query"] 
    && typeof socket["handshake"]["query"]["user_id"] != "undefined" 
    && socket["handshake"]["query"]["user_id"]) {

    var userId = socket["handshake"]["query"]["user_id"];

    userSocket[userId] = socket;
    
    Pi.find({user_id: userId}, function (err, pis) {
      if (err) return console.info('err : ' + err);
      if (!pis) return console.info('not found pis');

      _.each(pis, function(pi) {

        if (piSocket[pi.serial_number]) {
          socket.emit('pi:online', pi);
        }

      });
    });

    console.info('user online: ' + _.keys(userSocket).length);
  } 

  // Insert sockets below
  require('../api/pi/pi.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    socket.on('pi:action', function (data) {

      // console.info(data);
      if (typeof piSocket[data.serial_number] != 'undefined') {
        piSocket[data.serial_number].emit("pi:action", "play sound");
      }

    });
    
    socket.on('pi:receive', function (item) {

      var thing = item.split(',')[0];
      var data = item.split(',')[1];
      var serialNumber = socket["handshake"]["query"]["serial_number"];

      Pi.find({serial_number: serialNumber}, function (err, pis) {
        if (err) return console.info('err : ' + err);
        if (!pis) return console.info('not found pis');

        _.each(pis, function(pi) {
          if (userSocket[pi.user_id]) {
            userSocket[pi.user_id].emit("pi:receive:" + thing + ":" + serialNumber, data);
          }

        });
      });

      
    });

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      // console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    // console.info('[%s] CONNECTED', socket.address);
  });
};