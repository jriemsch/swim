(function () {
    var module = angular.module('SwimApp', ['ui.bootstrap', 'ngRoute']);

    module.filter('duration', function () {
            return function (duration) {
                if (duration) {
                    var hours = Math.floor(duration % (3600 * 24) / 3600);
                    var mins = Math.floor(duration % 3600 / 60);
                    var secs = Math.floor(duration % 60);
                    var msec = Math.floor(duration * 1000 % 1000);
                    var withoutHours = (mins < 10 ? '0' : '') + mins + ':' + (secs < 10 ? '0' : '') + secs + ',' + (msec < 100 ? '0' : '') + (msec < 10 ? '0' : '') + msec;
                    return hours > 0 ? hours + ':' + withoutHours : withoutHours;
                }
                return '';
            };
        });

    module.config(function ($routeProvider) {
        $routeProvider
            .when('/info', {templateUrl: 'info.html'})
            .when('/trainings', {templateUrl: 'trainings.html', controller: 'TrainingsCtrl'})
            .when('/stats', {templateUrl: 'stats.html', controller: 'StatsCtrl'})
            .when('/import', {templateUrl: 'import.html', controller: 'ImportCtrl'})
            .otherwise({redirectTo: '/info'});
    });
})();
