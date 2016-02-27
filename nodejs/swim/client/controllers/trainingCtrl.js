(function () {
    var module = angular.module('SwimApp');

    var trainingsCtrl = function ($scope, swim) {
        $scope.trainings = [];

        swim.getTrainings().success(function (trainings) {
            $scope.trainings = [];
            var last = null;
            var trainingsOfTheWeek = [];
            for (var idx = 0; idx < trainings.length; ++idx) {
                var training = trainings[idx];
                var week = getWeekOfYear(training.startedAt);
                if (last && last !== week) {
                    nextWeek(last);
                }
                training.intervalsHidden = true;
                trainingsOfTheWeek.push(training);
                last = week;
            }

            nextWeek(last);

            function nextWeek(last) {
                if (trainingsOfTheWeek.length > 0) {
                    var distance = 0;
                    for (var idx = 0; idx < trainingsOfTheWeek.length; ++idx) {
                        distance += trainingsOfTheWeek[idx].distance;
                    }
                    $scope.trainings.push({week: last, trainingsOfTheWeek: trainingsOfTheWeek, distance: distance});
                    trainingsOfTheWeek = [];
                }
            }
        });

        $scope.toggleIntervals = function (training) {
            training.intervalsHidden = !training.intervalsHidden;
            if (!training.intervalsHidden) {
                swim.getIntervalsByTraining(training).success(function (intervals) {
                    training.intervals = [];
                    var setIdx = 1;
                    var intervalIdx = 0;
                    for (var idx = 0; idx < intervals.length; ++idx) {
                        var interval = intervals[idx];
                        if (interval.distance > 0) {
                            interval.setIdx = setIdx;
                            training.intervals[intervalIdx] = interval;
                            ++intervalIdx;
                        } else {
                            if (intervalIdx > 0) {
                                training.intervals[intervalIdx - 1].rest = interval.duration;
                                setIdx += interval.duration > 35 ? 1 : 0;
                            }
                        }
                    }
                });
            }
        };

        function getWeekOfYear(startedAt){
            var d = new Date(startedAt);
            d.setHours(0,0,0);
            d.setDate(d.getDate()+4-(d.getDay()||7));
            return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7) + ' / ' + d.getFullYear();
        }
    };

    module.controller('TrainingsCtrl', ['$scope', 'swim', trainingsCtrl]);
})();

