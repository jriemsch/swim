angular.module('SwimApp').controller('SwimCtrl', ['$scope', 'swim', '$sce', function ($scope, swim, $sce) {
        $scope.views = {
            stats: createStatsView(),
            graph: createGraphView(),
            trainings: createTrainingsView(),
            import: createImportView()
        };

        function showView(view) {
            for (var key in $scope.views) {
                if ($scope.views.hasOwnProperty(key)) {
                    $scope.views[key].hidden = true;
                }
            }
            view.hidden = false;
        }

        function createView() {
            var view = {
                hidden: true,
                show: function () {
                    showView(view);
                }
            };
            return view;
        }

        function createStatsView() {
            return createView();
        }

        function createGraphView() {
            var view = createView();

            view.selectedBestTime = '';
            view.bestTime = '';

            view.show = function () {
                showView(view);
                swim.getBestTimes().success(function (bestTimes) {
                    view.bestTimes = bestTimes;
                });
            };

            view.showBestTimes = function (bestTime) {
                view.bestTime = bestTime;
                view.bestTimeHistory = [];
                swim.getBestTimesByStrokeAndDistance(bestTime._id.strokeType, bestTime._id.distance).success(function (bestTimeHistory) {
                    view.bestTimeHistory = bestTimeHistory;
                });
            };

            return view;
        }

        function createTrainingsView() {
            var view = createView();

            view.trainings = [];

            view.show = function () {
                showView(view);
                swim.getTrainings().success(function (trainings) {
                    view.trainings = [];
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
                            view.trainings.push({week: last, trainingsOfTheWeek: trainingsOfTheWeek, distance: distance});
                            trainingsOfTheWeek = [];
                        }
                    }
                });
            };

            view.toggleIntervals = function (training) {
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

            return view;
        }

        function createImportView() {
            var view = createView();
            resetView();

            view.show = function () {
                resetView();
                showView(view);
            };

            view.showActivity = function () {
                ++view.step;
                view.splitsUrl = $sce.trustAsResourceUrl('https://connect.garmin.com/proxy/activity-service/activity/' + view.activityId +'/splits');
                view.activityUrl = $sce.trustAsResourceUrl('https://connect.garmin.com/proxy/activity-service/activity/' + view.activityId);
            };

            view.import = function () {
                ++view.step;
                swim.importTraining(view.activityJson, view.splitsJson).success(function () {
                    resetView();
                });
            };

            return view;

            function resetView() {
                view.step = 0;
                view.activityId = '';
                view.splitsJson = '';
                view.activityJson = '';
                view.splitsUrl = '';
                view.activityUrl = '';
            }
        }
    }
]);
