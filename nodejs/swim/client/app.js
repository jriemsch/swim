angular.module('SwimApp', ['ui.bootstrap'])
    .filter('duration', function () {
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
