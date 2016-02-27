var StrokeType = require('./StrokeType');
var Trainings = require('./Trainings');
var Promise = require('./Promise');

module.exports = {
    createTrainingFromActivity: function (garminData) {
        var splits = garminData.splits;
        var training = {
            startedAt: new Date(garminData.activity.summaryDTO.startTimeGMT),
            intervals: []
        };

        for (var idx = 0; idx < splits.lapDTOs.length; ++idx) {
            training.intervals[idx] = createInterval(splits.lapDTOs[idx]);
        }

        return enrichTraining(training);

        function enrichTraining(training) {
            training.strokes = 0;
            training.distance = 0;
            training.calories = 0;
            training.duration = 0;
            training.activeDuration = 0;
            for (var idx = 0; idx < training.intervals.length; ++idx) {
                var interval = training.intervals[idx];
                training.strokes += interval.strokes;
                training.distance += interval.distance;
                training.calories += interval.calories;
                training.duration += interval.duration;
                training.activeDuration += interval.activeDuration;
            }
            return enrich(training);
        }

        function createInterval(lapDTO) {
            if (lapDTO.distance > 0) {
                var interval = {
                    startedAt: new Date(lapDTO.startTimeGMT),
                    distance: lapDTO.distance || 0,
                    duration: lapDTO.duration || 0,
                    activeDuration: lapDTO.duration || 0,
                    calories: lapDTO.calories || 0,
                    strokes: lapDTO.totalNumberOfStrokes || 0,
                    lanes: []
                };
                for (var idx = 0; idx < lapDTO.lengthDTOs.length; ++idx) {
                    interval.lanes[idx] = createLane(lapDTO.lengthDTOs[idx]);
                }
                interval.strokeType = StrokeType.detect(interval.lanes);
                return enrich(interval);
            } else {
                return {
                    startedAt: new Date(lapDTO.startTimeGMT),
                    distance: 0,
                    duration: lapDTO.duration || 0,
                    activeDuration: 0,
                    calories: 0,
                    strokes: 0,
                    lanes: [],
                    pace: 0,
                    swolf: 0
                };
            }
        }

        function createLane(lengthDTO) {
            return enrich({
                distance: lengthDTO.distance || 0,
                duration: lengthDTO.duration || 0,
                activeDuration: lengthDTO.duration || 0,
                strokes: lengthDTO.totalNumberOfStrokes || 0,
                strokeType: StrokeType.createFromGarmin(lengthDTO.swimStroke)
            });
        }

        function enrich(data) {
            data.pace = data.activeDuration * 100 / data.distance;
            data.swolf = (data.strokes + data.activeDuration) * 25 / data.distance;
            return data;
        }
    },

    saveTraining: function (training) {
        var promise = Promise.create();
        Trainings.byStartedAt(training.startedAt).onSuccess(function (existing) {
            if (existing) {
                training._id = existing._id;
            }
            Trainings.save(training).chain(promise);
        }).onError(promise);
        return promise;
    }
};
