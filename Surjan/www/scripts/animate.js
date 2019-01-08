function animate(obj, properties, duration, callback){
    var pcount = 0;
    var aprent = {
        parentObj: obj,
        finished: 0,
        total: 0,
        callback: callback
    };
    obj.animation = aprent;
    for (var key in properties) {
        if (properties.hasOwnProperty(key)) {
            _animate(obj, key, properties[key], duration, aprent);
            pcount++;
        }
    }

    aprent.total = pcount;

}

function pAnimationFinished(aparent) {
    aprent.finished++;
    if (aprent.finished >= aprent.total) {
        aprent.parentObj.animation = null;
        if (aprent.callback) aprent.callback();
    }
}

function _animate(obj, property, to, duration, aparent) {
    var requireUnit = isNaN(to);
    var unit;
    var start = obj[property] ? obj[property] : 0;
    console.log(start);
    if (requireUnit) {
        var toVal = ant_utils_parseUnitValue(to);
        to = toVal.value;
        unit = toVal.unit;
        start = obj[property] ? (isNaN(start) ? ant_utils_parseUnitValue(obj[property]).value : start) : 0;
    }
    var change = to - start,
        currentTime = 0,
        increment = 20;
    var _animation = function () {
        currentTime += increment;   
        var val = Math.easeInOutQuad(currentTime, start, change, duration);
        obj[property] = unit ? val + unit : val;
        if (currentTime < duration) {
            setTimeout(_animation, increment);
        } else {
            pAnimationFinished(aparent);
        }
    };
    _animation();

}

function ant_utils_parseUnitValue(value) {
    var ci = value.length - 1;

    while (isNaN(value.charAt(ci--))) { }
    ci += 2;

    return {
        value: value.substr(0, ci),
        unit: value.substr(ci)
    };
}