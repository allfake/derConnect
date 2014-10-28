'use strict';

var _ = require('lodash');
var Pi = require('./pi.model');

// Get list of pis
exports.index = function(req, res) {
  Pi.find(function (err, pis) {
    if(err) { return handleError(res, err); }
    return res.json(200, pis);
  });
};

// Get a single pi
exports.show = function(req, res) {
  Pi.findById(req.params.id, function (err, pi) {
    if(err) { return handleError(res, err); }
    if(!pi) { return res.send(404); }
    return res.json(pi);
  });
};

// Creates a new pi in the DB.
exports.create = function(req, res) {
  console.log(req.body);
  Pi.create(req.body, function(err, pi) {
    if(err) { return handleError(res, err); }
    return res.json(201, pi);
  });
};

// Updates an existing pi in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pi.findById(req.params.id, function (err, pi) {
    if (err) { return handleError(res, err); }
    if(!pi) { return res.send(404); }
    var updated = _.merge(pi, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, pi);
    });
  });
};

// Deletes a pi from the DB.
exports.destroy = function(req, res) {
  Pi.findById(req.params.id, function (err, pi) {
    if(err) { return handleError(res, err); }
    if(!pi) { return res.send(404); }
    pi.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}