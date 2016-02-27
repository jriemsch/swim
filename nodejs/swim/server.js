var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');

var TrainingService = require('./TrainingService');
var Trainings = require('./Trainings');

var PORT = 8080;

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/client', express.static(__dirname + '/client'));

app.put('/trainings', function (req, res) {
    var training = TrainingService.createTrainingFromActivity(req.body);
    TrainingService.saveTraining(training).onSuccess(function () {
        res.json(training);
    }).onError(function (err) {
        res.status(500).json(err);
    });
});

app.get('/trainings', function (req, res) {
    Trainings.all().onSuccess(function (trainings) {
        res.json(trainings);
    }).onError(function (err) {
        res.status(500).json(err);
    });
});

app.get('/trainings/:trainingId/intervals', function (req, res) {
    var trainingId = req.params.trainingId;
    Trainings.byId(trainingId).onSuccess(function (training) {
        res.json(training.intervals);
    }).onError(function (err) {
        res.status(500).json(err);
    });
});

app.get('/besttimes/', function (req, res) {
    Trainings.allBestTimes().onSuccess(function (bestTimes) {
        res.json(bestTimes);
    }).onError(function (err) {
        res.status(500).json(err);
    });
});

app.get('/besttimes/:strokeType/:distance', function (req, res) {
    var distance = parseInt(req.params.distance);
    var strokeType = req.params.strokeType;
    var limit = parseInt(req.query.limit);
    Trainings.bestTimeHistory(strokeType, distance, limit).onSuccess(function (bestTimeHistory) {
        res.json(bestTimeHistory);
    }).onError(function (err) {
        res.status(500).json(err);
    });
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

app.listen(PORT, function () {
    console.log('Running on http://localhost:' + PORT);
});

function shutdown() {
    console.log('Shutdown signal received');
    app.close(function () {
        console.log('Stopped running');
        process.exit(128);
    });
}
