var Callback = {
    parallel: function (values, operation, callback) {
        var countingCallback = createCountingCallback(values.length, callback);
        for (var idx = 0; idx < values.length; ++idx) {
            operation(values[idx], countingCallback);
        }
    },

    parallelChunks: function (values, chunkSize, operation, callback) {
        var valueChunks = [];
        for (var idx = 0; idx < values.length; ++idx) {
            var chunkIdx = Math.floor(idx / chunkSize);
            var idxInChunk = idx % chunkSize;
            if (idxInChunk === 0) {
                valueChunks[chunkIdx] = [values[idx]];
            } else {
                valueChunks[chunkIdx].push(values[idx]);
            }
        }

        Callback.serial(valueChunks, function (chunk, chunkDoneCallback) {
            Callback.parallel(chunk, operation, chunkDoneCallback);
        }, callback);
    },

    serial: function (values, operation, callback) {
        processFile(0);

        function processFile(idx) {
            if (idx < values.length) {
                operation(values[idx], function () {
                    processFile(idx + 1);
                });
            } else {
                callback();
            }
        }
    }
};

module.exports = Callback;

function createCountingCallback(count, callback) {
    var called = 0;
    return function () {
        ++called;
        if (called === count) {
            callback();
        }
    };
}

