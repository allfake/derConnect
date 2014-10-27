'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PiSchema = new Schema({
  name: String,
  serial_number: String,
  user_id: String,
  action: [ 
    {
      name: String,
      data: String,
      type: String
    }
  ],
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Pi', PiSchema);