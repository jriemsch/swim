(function () {

    var swim = function ($http) {
        return {
            getBestTimes: function () {
                return $http.get('/besttimes');
            },

            getBestTimesByStrokeAndDistance: function (strokeType, distance) {
                return $http.get('/besttimes/' + strokeType + '/' + distance + '?limit=50');
            },

            getTrainings: function () {
                return $http.get('/trainings');
            },

            getIntervalsByTraining: function (training) {
                return $http.get('/trainings/' + training._id + '/intervals');
            },

            importTraining: function (activityJson, splitsJson) {
                var json = '{"activity":' + activityJson + ', "splits":' + splitsJson + '}';
                return $http.put('/trainings', json);
            }
        };
    };

    var module = angular.module('SwimApp');
    module.factory('swim',  swim);
})();

