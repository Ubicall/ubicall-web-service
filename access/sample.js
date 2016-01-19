/* jshint ignore:start */

db.log.remove({});
db.report.remove({});

var day = new Date();
day.setHours(0);
day.setMinutes(0);
day.setSeconds(0);
day.setMilliseconds(0);


var start = new Date();
start.setMinutes(0);
start.setSeconds(0);
start.setMilliseconds(0);

var end = new Date();
end.setHours(end.getHours() + 1);
end.setMinutes(0);
end.setSeconds(0);
end.setMilliseconds(0);

var licence_keys = db.log.distinct("licence_key", {
    datetime: {
        $gte: start,
        $lt: end
    }
});
var count = db.log.count({
    datetime: {
        $gte: start,
        $lt: end
    }
});

print(" there are " + count + " log add from " + start + " to " + end);
print("changes for => \n" + licence_keys);

if (licence_keys && licence_keys.length > 0) {
    var smpl = licence_keys[0];
    var count = db.log.count({
        licence_key: smpl,
        datetime: {
            $gte: start,
            $lt: end
        }
    });

    print(smpl + " has " + count);
    print("logs is ");
    db.log.find({
        licence_key: smpl,
        datetime: {
            $gte: start,
            $lt: end
        }
    }, {
        datetime: 1,
        licence_key: 1,
        category: 1
    });
    print("report is ");
    db.report.find({
        licence_key: smpl,
        datetime: day
    });
}



/* jshint ignore:end */