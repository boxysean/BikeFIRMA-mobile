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

var host = 'http://boxysean.com:3000';
// var host = 'http://localhost:3000';

var app = {
    positionQueue: [],
    checkinIdx: 0,
    checkinImages: ['img/assets/CHECK_IN_0.png', 'img/assets/CHECK_IN_1.png', 'img/assets/CHECK_IN_2.png', 'img/assets/CHECK_IN_3.png'],
    currentUser: "",

    resetUser: function(user) {
        this.currentUser = undefined;
    },

    setUser: function(user) {
        $('.bf-username').html(user);
        this.currentUser = user;
    },

    setTotalColumns: function(distance) {
        $('.bf-total-column-1').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-total-column-2').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-total-column-3').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-total-column-4').html(distance % 10);
    },

    setRideColumns: function(distance) {
        $('.bf-ride-column-1').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-ride-column-2').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-ride-column-3').html(distance % 10);
        distance = Math.floor(distance / 10);
        $('.bf-ride-column-4').html(distance % 10);
    },

    setConnectedToTwitter: function(connected) {
        if (connected) {
            $('.bf-twitter-connect-button')
                .css('background-image', 'url(img/assets/TWITTER_connected.png)')
                .attr('connected', true)
                .attr('href', '#');

            $('.bf-twitter-button')
                .css('background-image', 'url(img/assets/TWITTER_shared.png)')
                .attr('connected', true)
        } else {
            $('.bf-twitter-connect-button')
                .css('background-image', 'url(img/assets/TWITTER.png)')
                .attr('connected', false)
                .attr('href', host + '/connect/twitter');

            $('.bf-twitter-button')
                .css('background-image', 'url(img/assets/TWITTER__1.png)')
                .attr('connected', false);
        }
    },

    // Application Constructor
    initialize: function() {
        var _this = this;

        this.bindEvents();

        $('#server').val('http://boxysean.com:3000');
        $('#bikename').val('Test');
        $('#sendlocation').prop('checked', true);

        $('.bf-back-button, .bf-back-action').click(function () {
            var obj = $(this);
            var nTimes = $(this).attr("pages-back") || 1;
            parent.history.go(-nTimes);
            return false;
        });

        $('.bf-setting-button').click(function() {
        });

        $('#bf-button-signup').click(function() {
            var url = host + '/signup';
            var username = $('#bf-signup-username').val();

            var jsonpCallback = function (data) {
                console.log("jsonpCallback");
                console.log(data);
            };

            $.ajax({
                url: url,
                dataType: 'jsonp',
                timeout: 5000,
                data: $('#bf-form-signup').serialize(),
                jsonpCallback: 'jsonpCallback',
                success: function (data) {
                    if (data && 'error' in data) {
                        alert('could not sign up');
                    } else {
                        alert("signed up!");
                        _this.setUser(username);
                        $('#bf-signup-email').val("");
                        $('#bf-signup-username').val("");
                        $('#bf-signup-password').val("");
                    }
                },
                error: function (data) {
                    alert('could not sign up');
                }
            });

            return false;
        });

        $('#bf-button-login').click(function() {
            var url = host + '/login';
            var username = $('#bf-login-username').val();

            var jsonpCallback = function (data) {
                console.log("jsonpCallback");
                console.log(data);
            };

            $.ajax({
                url: url,
                timeout: 5000,
                dataType: 'jsonp',
                data: $('#bf-form-login').serialize(),
                jsonpCallback: 'jsonpCallback',
                success: function (data) {
                    if (data && 'error' in data) {
                        window.location.href = '#logginginerror';
                    } else {
                        window.location.href = '#ride';
                        _this.setUser(username);
                        $('#bf-login-username').val("");
                        $('#bf-login-password').val("");

                        if (data && 'twitter' in data) {
                            _this.setConnectedToTwitter(true);
                        } else {
                            _this.setConnectedToTwitter(false);
                        }
                    }
                },
                error: function () {
                    window.location.href = '#logginginerrornoconnection';
                }
            });

            window.location.href = '#loggingin';

            return false;
        });

        $('.bf-logout-button').click(function() {
            var url = host + '/logout';
            var username = $('#bf-login-username').val();

            $.ajax({
                type: 'POST',
                dataType: 'jsonp',
                url: url,
                data: $('#bf-form-login').serialize()
            });

            window.location.href = '#intro';
            _this.resetUser();

            return false;
        });

        $('.bf-twitter-button').click(function() {
            if ($(this).attr('connected')) {
                var url = host + '/connect/twitter/tweet';

                $.ajax({
                    type: 'GET',
                    dataType: 'jsonp',
                    url: url,
                    jsonpCallback: 'jsonpCallback',
                    success: function (data) {
                        alert('success!');
                        console.log(data);
                    },
                    error: function() {
                        alert('error!');
                    }
                });
            }

            return false;
        });

        // Animated JPG -- checkin graphic

        setInterval(function () {
            $('#checkin-graphic').attr('src', _this.checkinImages[_this.checkinIdx++]);
            if (_this.checkinIdx >= _this.checkinImages.length) {
                _this.checkinIdx = 0;
            }
        }, 700);
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
