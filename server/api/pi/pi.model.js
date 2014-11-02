'use strict';
var socketio = require('../../config/socketio');
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;


var ActionSchema = new Schema({
  name: String,
  data: String,
  type: String
})

var ScheduleSchema = new Schema({
  name: String,
  data: String,
  type: String,
  fire: Date,
  interval: Number,
  interval_type: String
})

var PiSchema = new Schema({
  name: String,
  serial_number: String,
  user_id: String,
  action: [ActionSchema],
  schedule: [ScheduleSchema],
  info: String,
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

module.exports = mongoose.model('action', ActionSchema);
module.exports = mongoose.model('schedule', ScheduleSchema);
module.exports = mongoose.model('Pi', PiSchema);