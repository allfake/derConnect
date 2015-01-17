/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var DeviceType = require('./deviceType.model');

exports.register = function(socket) {
  DeviceType.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  DeviceType.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('deviceType:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('deviceType:remove', doc);
}