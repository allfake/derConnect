/* global io */
'use strict';

angular.module('derConnectApp')
  .factory('socket', function(socketFactory, Auth, User) {

    // socket.io now auto-configures its connection when we ommit a connection url

    var user_query = '';
    if (Auth.isLoggedIn()) {
      user_query = '&user_id=' + Auth.getCurrentUser()._id;
    };

    var ioSocket = io('', {
      // Send auth token on connection, you will need to DI the Auth service above
      'query': 'token=' + Auth.getToken() + user_query,
      path: '/socket.io-client'
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    return {
      socket: socket,

      syncPi: function(modelName, array) {
        socket.on(modelName + ':action', function (item) {
          console.log(item);
        });

      },

      playSound: function(pi) {
        socket.emit('pi:action', pi);
      },

      piAction: function(pi, action) {
        socket.emit('pi:action', pi);
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

      piReceive: function(thing, serial_number, pi, cb) {
        cb = cb || angular.noop;
        socket.on('pi:receive:' + thing + ":" + serial_number, function (item) {

          pi[thing] = item;

          cb(thing, item, pi);

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
