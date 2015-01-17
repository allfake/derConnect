'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceTypeSchema = new Schema({
  name: String,
  type: String,
  active: Boolean
});

module.exports = mongoose.model('DeviceType', DeviceTypeSchema);