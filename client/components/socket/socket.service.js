/* global io */
'use strict';

angular.module('derConnectApp')
  .factory('socket', function(socketFactory, Auth, User) {

    // socket.io now auto-configures its connection when we ommit a connection url
    var socket = {};
    var currentUser = Auth.getCurrentUser();
    var user_query = '';
    Auth.isLoggedInAsync(function () {

      user_query = '&user_id=' + Auth.getCurrentUser()._id;
      
      var ioSocket = io('', {
        // Send auth token on connection, you will need to DI the Auth service above
        'query': 'token=' + Auth.getToken() + user_query,
        path: '/socket.io-client'
      });

      socket = socketFactory({
        ioSocket: ioSocket
      });
    })

    return {
      socket: socket,

      syncPi: function(modelName, array) {
        socket.on(modelName + ':action', function (item) {
          console.log(item);
        });

      },

      playSound: function(pi) {
        socket.emit('pi:action', 'playsound');
      },

      piAction: function(pi, action) {
        socket.emit('pi:action', action);
      },

      piBleReScan: function () {

        var action = 
        {
          type: 'bleReScan',
          data: 1
        }

        socket.emit('pi:action', action);
      },

      piOnline: function (array) {

        socket.on('pi:online', function (data) {
          array = _.map(array, function (pi) {
            if (pi.serial_number == data.serial_number) {
              pi.status = 1;
            } else {
              pi.status = 0;
            }
            return pi;
          });
        });
      },

      piOffline: function (array) {
        
        socket.on('pi:offline', function (data) {
          array = _.map(array, function (pi) {
            if (pi.serial_number == data.serial_number) {
              pi.status = 0;
            }
            return pi;            
          });
        })
      },

      piReceive: function(thing, serial_number, pi, deviceTypes, cb) {
        cb = cb || angular.noop;
        socket.on('pi:receive:' + thing + ":" + pi.serial_number + ":" + serial_number, function (item) {

          if (thing == 'bleList') {
            item.name = item.name || "undefined";
            item.serial_number = item.uuid;
            pi.bles.push(item)
          } else {
            angular.forEach(pi.devices, function (device) {
              angular.forEach(device.receive, function (value, key) {

                if (device.type == thing) {

                  device.receive[key].data = item;
                  device.receive[key].last_update = new Date();

                  cb(thing, item, pi);
                }
              });
            });
          }

        });

      },

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdatesPi: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save:' + currentUser._id, function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection

          if (oldItem) {

            angular.forEach(oldItem.deveices, function (device) {
              angular.forEach(device.receive, function (value) {
                socket.removeAllListeners('pi:receive:' + value.type + ":" + oldItem.serial_number);
              });
            });

            if (item.receive) {
              item.receive.edit = {};
            }

            if (oldItem.status) {
              item.status = oldItem.status;
            }

            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          for (var i = 0; i < array.length; i++) {
            var pi = array[i];

            angular.forEach(pi.deveices, function (device) {
              angular.forEach(device.receive, function(receive) {
                socket.on('pi:receive:' + receive.type + ":" + pi.serial_number, function (item) {
                  angular.forEach(pi.receive, function (value, key) {
                    if (value.type == receive.type) {

                      pi.receive[key].data = item;
                      pi.receive[key].last_update = new Date();
                    }
                  });
                });
              });
            });
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      }
    };
  });
