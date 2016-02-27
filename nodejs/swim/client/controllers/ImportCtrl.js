(function () {
    var module = angular.module('SwimApp');

    var importCtrl = function ($scope, swim, $sce) {
        resetView();

        $scope.showActivity = function () {
            ++$scope.step;
            $scope.splitsUrl = $sce.trustAsResourceUrl('https://connect.garmin.com/proxy/activity-service/activity/' + $scope.activityId +'/splits');
            $scope.activityUrl = $sce.trustAsResourceUrl('https://connect.garmin.com/proxy/activity-service/activity/' + $scope.activityId);
        };

        $scope.import = function () {
            ++$scope.step;
            swim.importTraining($scope.activityJson, $scope.splitsJson).success(function () {
                resetView();
            });
        };

        function resetView() {
            $scope.step = 0;
            $scope.activityId = '';
            $scope.splitsJson = '';
            $scope.activityJson = '';
            $scope.splitsUrl = '';
            $scope.activityUrl = '';
        }
    };

    module.controller('ImportCtrl', ['$scope', 'swim', '$sce', importCtrl]);
})();
