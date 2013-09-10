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

var app = {
    positionQueue: [],

    // Application Constructor
    initialize: function() {
        this.bindEvents();

        $('#server').val('http://boxysean.com:3000');
        $('#bikename').val('Test');
        $('#sendlocation').prop('checked', true);

        $('.bf-back-button').click(function () {
            parent.history.back();
            return false;
        });

        $('#bf-button-signup').click(function() {
            var url = 'http://localhost:3000/signup';

            $.ajax({
                type: 'POST',
                url: url,
                data: $('#bf-form-signup').serialize(),
                success: function (data) {
                    alert("signed up!");
                }
            })

            return false;
        });

        $('#bf-button-login').click(function() {
            var url = 'http://localhost:3000/login';

            $.ajax({
                type: 'POST',
                url: url,
                data: $('#bf-form-login').serialize(),
                success: function (data) {
                    alert("logged in!");
                }
            })

            return false;
        });
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        // app.receivedEvent('deviceready'); // ugly hack!
        // console.log('ugly hack!');
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('device ready!');
        app.receivedEvent('deviceready');
    },

    hasConnection: function() {
        if (!navigator.connection) {
            return true; // running from in-browser
        }

        switch (navigator.connection.type) {
            case Connection.ETHERNET:
            case Connection.WIFI:
            case Connection.CELL_2G:
            case Connection.CELL_3G:
            case Connection.CELL_4G:
            case Connection.CELL:
                return true;

            default:
                return false;
        }
    },

    updatePosition: function (latitude, longitude) {
        console.log("update! " + latitude + " " + longitude);
        var timestamp = $.now();

        this.positionQueue.push({
            latitude: latitude,
            longitude: longitude,
            timestamp: timestamp
        });

        if (this.hasConnection()) {
            var bikename = $('#bikename').val(),
                server = $('#server').val();

            var req = $.ajax({
                url: server + '/bikes/' + bikename + '/position',
                type: 'post',
                data: { positions: this.positionQueue },
                success: function (res, textStatus, jqXHR) {
                    $('#lastupdate').val($.now());
                },
                fail: function (jqXHR, textStatus, errorThrown) {
                    console.log("error: " + textStatus);
                }
            });

            this.positionQueue = [];
        }

        $('#location').val(latitude + ', ' + longitude);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        (function (app) {
            console.log('setting interval');
            setInterval(function () {
                // console.log("interval!");

                var onSuccess = function (position) {
                    app.updatePosition(position.coords.latitude, position.coords.longitude);
                };

                var onError = function (error) {
                    // app.updatePosition(90 - (Math.random() * 180), 180 - (Math.random() * 360));
                    console.log("error finding position " + error);
                };

                if ($('#sendlocation').prop('checked') && $('#bikename').val().length > 0) {
                    // console.log('checking location...');
                    navigator.geolocation.getCurrentPosition(onSuccess, onError, { timeout: 10000 });
                }
            }, 2000);
        })(this);
    }
};
