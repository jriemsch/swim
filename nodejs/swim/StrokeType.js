var StrokeType = {
    FREE: {},
    BACK: {},
    BREAST: {},
    BUTTERFLY: {},
    MEDLEY: {},
    UNKNOWN: {},
    MIXED: {}
};

for (var key in StrokeType) {
    if (StrokeType.hasOwnProperty(key)) {
        StrokeType[key].tag = key;
    }
}

StrokeType.createFromGarmin = function (garminSwimStroke) {
    var garminStyleMapping = {
        FREESTYLE: StrokeType.FREE.tag,
        BACKSTROKE: StrokeType.BACK.tag,
        BREASTSTROKE: StrokeType.BREAST.tag,
        BUTTERFLY: StrokeType.BUTTERFLY.tag
    };

    return garminStyleMapping[garminSwimStroke] || StrokeType.UNKNOWN.tag;
};

StrokeType.detect = function (lanes) {
    var orderedTypes = [];
    var orderedLaneCounts = [];
    var lastType = null;
    for (var idx = 0; idx < lanes.length; ++idx) {
        var lane = lanes[idx];
        if (!lastType || lane.strokeType !== lastType) {
            lastType = lane.strokeType;
            orderedTypes.push(lane.strokeType);
            orderedLaneCounts.push(1);
        } else {
            orderedLaneCounts[orderedLaneCounts.length - 1] += 1;
        }
    }

    if (orderedTypes.length === 0) {
        return StrokeType.UNKNOWN.tag;
    }

    if (orderedTypes.length === 1) {
        return lastType;
    }

    if (orderedTypes.length === 4 &&
        orderedTypes[0] === StrokeType.BUTTERFLY.tag &&
        orderedTypes[1] === StrokeType.BACK.tag &&
        orderedTypes[2] === StrokeType.BREAST.tag &&
        orderedTypes[3] === StrokeType.FREE.tag &&
        orderedLaneCounts[0] === orderedLaneCounts[1] &&
        orderedLaneCounts[0] === orderedLaneCounts[2] &&
        orderedLaneCounts[0] === orderedLaneCounts[3]) {
        return StrokeType.MEDLEY.tag;
    }

    return StrokeType.MIXED.tag;
};

module.exports = StrokeType;
