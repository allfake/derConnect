'use strict';

var _ = require('lodash');
var DeviceType = require('./deviceType.model');

// Get list of deviceTypes
exports.index = function(req, res) {
  DeviceType.find(function (err, deviceTypes) {
    if(err) { return handleError(res, err); }
    return res.json(200, deviceTypes);
  });
};

// Get a single deviceType
exports.show = function(req, res) {
  DeviceType.findById(req.params.id, function (err, deviceType) {
    if(err) { return handleError(res, err); }
    if(!deviceType) { return res.send(404); }
    return res.json(deviceType);
  });
};

// Creates a new deviceType in the DB.
exports.create = function(req, res) {
  DeviceType.create(req.body, function(err, deviceType) {
    if(err) { return handleError(res, err); }
    return res.json(201, deviceType);
  });
};

// Updates an existing deviceType in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  DeviceType.findById(req.params.id, function (err, deviceType) {
    if (err) { return handleError(res, err); }
    if(!deviceType) { return res.send(404); }
    var updated = _.merge(deviceType, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, deviceType);
    });
  });
};

// Deletes a deviceType from the DB.
exports.destroy = function(req, res) {
  DeviceType.findById(req.params.id, function (err, deviceType) {
    if(err) { return handleError(res, err); }
    if(!deviceType) { return res.send(404); }
    deviceType.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}