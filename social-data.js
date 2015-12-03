"use strict";

var SocialData;

(function() {

    var sources = [
        'Facebook likes',
        'Twitter',
        'Google search',
        'Youtube',
        'Linkedin'
    ];

    var maxData = 50;
    var wakeUpMinute = 4 * 60;
    var sleepMinute = 27 * 50;
    var clearMinute = sleepMinute + 3 * 50;

    function generateData(x, previousData) {

        var result = 0;

        if (x > wakeUpMinute && x < sleepMinute) {
            result = affine([wakeUpMinute, 0], [sleepMinute, maxData], x);

            // Add some random data
            result += random(-maxData / 10, maxData / 10);
            result = Math.max(previousData || 0, result);
        }

        if (x >= sleepMinute) {
            result = affine([sleepMinute, maxData], [clearMinute, 0], x);
        }

        return Math.max(0, result);
    }

    SocialData = {
        generateFakeData: function(minutesIncrement) {

            minutesIncrement = minutesIncrement || 1;

            var data = {};
            var previousData = {};
            var hoursGeneration = 27;

            for (var i = 0; i * minutesIncrement <= hoursGeneration * 60; i++) {
                data[i] = {};

                for (var j = 0; j < sources.length; j++) {
                    var x = (i * minutesIncrement);
                    data[i][sources[j]] = generateData(x, previousData[sources[j]]);
                }

                previousData = data[i];
            }

            return data;
        }
    };
})();
