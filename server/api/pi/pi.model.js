'use strict';
var socketio = require('../../config/socketio');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ActionSchema = new Schema({
  name: String,
  data: String,
  type: String,
  serial_number: String,
  display_name: String
})

var ScheduleSchema = new Schema({
  name: String,
  data: String,
  type: String,
  serial_number: String,
  fire: Date,
  interval: Number,
  interval_type: String,
  display_name: String
})

var ReceiveSchema = new Schema({
  name: String,
  data: String,
  type: String,
  serial_number: String,
  display_name: String,
  last_update: Date
})

var DeviceSchema = new Schema({
    name: String,
    type: String,
    active: Boolean,
    uuid: String,
    action: [ActionSchema],
    schedule: [ScheduleSchema],
    receive: [ReceiveSchema],
})

var PiSchema = new Schema({
  name: String,
  serial_number: String,
  user_id: String,
  devices: [DeviceSchema],
  info: String,
  scheduleSync: Number,
  active: Boolean
});

// Validate email is not taken
PiSchema
  .path('serial_number')
  .validate(function(value, respond) {

    var self = this;
    this.constructor.findOne({serial_number: value}, function(err, pi) {
      if(err) throw err;
      if(pi) {
        if(self.id === pi.id) return respond(true);
        return respond(false);
      }
      respond(true);
    });
}, 'The specified serial number is already in use.');

module.exports = mongoose.model('Action', ActionSchema);
module.exports = mongoose.model('Receive', ReceiveSchema);
module.exports = mongoose.model('Schedule', ScheduleSchema);
module.exports = mongoose.model('Device', DeviceSchema);
module.exports = mongoose.model('Pi', PiSchema);