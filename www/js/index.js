/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

var backend = 'http://localhost:3000';

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },

    updateLocation: function (latitude, longitude) {
        var bikename = $('#bikename').val();

        var req = $.ajax({
            url: backend + '/bikes/' + bikename + '/update',
            type: 'post',
            data: { 'latitude': latitude, 'longitude': longitude }
        });

        req.done(function (res, textStatus, jqXHR) {
            console.log("success! " + res);
        });

        req.fail(function (jqXHR, textStatus, errorThrown) {
            console.error("error! " + errorThrown);
        });

        $('#location').val(latitude + ', ' + longitude);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        console.log('yep');

        (function (app) {
            setInterval(function () {
                var onSuccess = function (position) {
                    app.updateLocation(position.coords.latitude, position.coords.longitude);
                };

                var onError = function (error) {
                    app.updateLocation(0, 0);
                };

                if ($('#sendlocation').prop('checked') && $('#bikename').val().length > 0) {
                    // console.log('checking location...');
                    navigator.geolocation.getCurrentPosition(onSuccess, onError);
                }
            }, 2000);
        })(this);
    },

    onSuccess: function(position) {
        
    },

    // onError Callback receives a PositionError object
    //
    onError: function(error) {
    }

};
