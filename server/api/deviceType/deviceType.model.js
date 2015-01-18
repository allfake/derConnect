'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var DeviceTypeSchema = new Schema({
  identifier: String,
  name: String,
  type: String,
  transform_function: String,
  active: Boolean
});

module.exports = mongoose.model('DeviceType', DeviceTypeSchema);