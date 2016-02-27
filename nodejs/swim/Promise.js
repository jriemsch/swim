module.exports = {
    create: function () {
        var errorCallbacks = [function (err) { console.error(err); }];
        var successCallbacks = [];
        var chained = [];

        var promise = function (err, data) {
            try {
                if (err) {
                    for (var idxError = 0; idxError < errorCallbacks.length; ++idxError) {
                        var newErr = errorCallbacks[idxError](err);
                        if (typeof(newErr) !== 'undefined' && newErr !== null) {
                            err = newErr;
                        }
                    }
                } else {
                    for (var idxSuccess = 0; idxSuccess < successCallbacks.length; ++idxSuccess) {
                        var newData = successCallbacks[idxSuccess](data);
                        if (typeof(newData) !== 'undefined' && newData !== null) {
                            data = newData;
                        }
                    }
                }

                for (var idxChained = 0; idxChained < chained.length; ++idxChained) {
                    chained[idxChained](err, data);
                }
            } catch (ex) {
                if (err) {
                    console.error(ex);
                } else {
                    promise(ex);
                }
            }
        };

        promise.onError = function (callback) { errorCallbacks.push(callback); return promise; };
        promise.onSuccess = function (callback) { successCallbacks.push(callback); return promise; };
        promise.chain = function (other) { chained.push(other); return promise; };

        return promise;
    }
};
