"use strict";

var SocialData;

(function() {

    var sources = [
        'Facebook'
    ];

    SocialData = {
        generateFakeData: function() {
            var data = {};
            for (var i = 0; i < sources.length; i++) {
                data[sources[i]] = {};

                for (var j = 0; j < 30; j++) {
                    data[sources[i]][j] = ~~random(100);
                }
            }

            return data;
        }
    };
})();
