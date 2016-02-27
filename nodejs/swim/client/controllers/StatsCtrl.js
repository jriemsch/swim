(function () {
    var module = angular.module('SwimApp');

    var statsCtrl = function ($scope, swim) {
        $scope.selectedBestTime = '';
        $scope.bestTime = '';

        swim.getBestTimes().success(function (bestTimes) {
            $scope.bestTimes = bestTimes;
        });

        $scope.showBestTimes = function (bestTime) {
            $scope.bestTime = bestTime;
            $scope.bestTimeHistory = [];
            swim.getBestTimesByStrokeAndDistance(bestTime._id.strokeType, bestTime._id.distance).success(function (bestTimeHistory) {
                $scope.bestTimeHistory = bestTimeHistory;
            });
        };
    };

    module.controller('StatsCtrl', ['$scope', 'swim', '$sce', statsCtrl]);
})();
