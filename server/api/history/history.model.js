'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var HistorySchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('History', HistorySchema);