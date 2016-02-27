var mongojs = require('mongojs');
var Promise = require('./Promise');

var db = mongojs('mongodb://mongo:27017/swim', ['trainings']);

db.on('ready',function() {
    db.trainings.ensureIndex('startedAt', Promise.create());
});

module.exports = {
    save: function (training) {
        var promise = Promise.create();
        db.trainings.save(training, promise);
        return promise;
    },

    all: function () {
        var promise = Promise.create();
        db.trainings.find({}, {intervals: 0}).sort({startedAt: -1}, promise);
        return promise;
    },

    byId: function (id) {
        var promise = Promise.create();
        db.trainings.findOne({_id: mongojs.ObjectId(id)}, promise);
        return promise;
    },

    byStartedAt: function (startedAt) {
        var promise = Promise.create();
        db.trainings.findOne({startedAt: startedAt}, promise);
        return promise;
    },

    allBestTimes: function () {
        var promise = Promise.create();
        db.trainings.aggregate([
            {$unwind: '$intervals'},
            {$match: {'intervals.distance': {$gt: 0}}},
            {$group: {_id: {strokeType: '$intervals.strokeType', distance: '$intervals.distance'}, cnt: {$sum: 1}, best: {$min: '$intervals.duration'}, worst: {$max: '$intervals.duration'}}},
            {$sort: {'cnt': -1}}],
            promise);
        return promise;
    },

    bestTimeHistory: function (strokeType, distance, limit) {
        var promise = Promise.create();
        db.trainings.aggregate([
                {$unwind: '$intervals'},
                {$match: {'intervals.distance': distance, 'intervals.strokeType': strokeType}},
                {$group: {_id: '$startedAt', duration: {$min: '$intervals.duration'}}},
                {$sort: {'_id': -1}},
                {$limit : limit}],
            promise);
        return promise;
    }
};
