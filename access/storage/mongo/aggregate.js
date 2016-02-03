var when = require("when");
var moment = require("moment");
var logSchema = require("./models/log");
var reportsSchema = require("./models/report");
var progressSchema = require("./models/progress");
var log = require("../../../log");
var $log, $report, $progress;

function clearReports() {
    return when.promise(function(resolve, reject) {
        $report.remove({}, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

function clearProgress() {
    return when.promise(function(resolve, reject) {
        $progress.remove({}, function(err) {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}

function aggregate(startDate, endDate) {
    var aggregateDeferred = when.defer();

    function ensureProgress() {
        var _ensureProgressDeferred = when.defer();

        $progress.findOneOrCreate({
            startDate: startDate,
            endDate: endDate
        }, {
            startDate: startDate,
            endDate: endDate,
            status: "running"
        }, function(err, progress) {
            if (err || !progress) {
                return _ensureProgressDeferred.reject(err || "no progress created/updated");
            }
            return _ensureProgressDeferred.resolve(progress);
        });

        return _ensureProgressDeferred.promise;
    }

    function progressUpdate(status) {
        var progressUpdateDeferred = when.defer();

        $progress.findOneAndUpdate({
                startDate: startDate,
                endDate: endDate
            }, {
                "$set": {
                    status: status
                }
            }, {
                new: true
            },
            function(err, progress) {
                if (err || !progress) {
                    return progressUpdateDeferred.reject(err || "no progress updated");
                }
                return progressUpdateDeferred.resolve(progress);
            });

        return progressUpdateDeferred.promise;
    }

    function getChanges() {
        var getChangesDeferred = when.defer();

        $log.aggregate([{
                $match: {
                    datetime: {
                        "$gte": startDate,
                        "$lt": endDate
                    }
                }
            }, {
                $group: {
                    _id: {
                        category: "$category",
                        licence_key: "$licence_key"
                    }
                }
            }],
            function(err, result) {
                if (err || !result || result.length === 0) {
                    return getChangesDeferred.reject(err || "no logs found");
                }
                return getChangesDeferred.resolve(result);
            });

        return getChangesDeferred.promise;
    }

    /**
     * create a report foreach change if not exist
     **/
    function ensureReport(changes) {
        function _ensureReport(licence_key, category) {
            var _ensureReportDeferred = when.defer();

            var reportDate = new Date(startDate.getTime());
            reportDate.setHours(0);
            reportDate.setMinutes(0);
            reportDate.setSeconds(0);
            reportDate.setMilliseconds(0);

            $report.findOneOrCreate({
                licence_key: licence_key,
                category: category,
                datetime: {
                    "$eq": reportDate
                }
            }, {
                licence_key: licence_key,
                category: category,
                datetime: reportDate
            }, function(err, report) {
                if (err || !report) {
                    return _ensureReportDeferred.reject(err || "no report created");
                }
                return _ensureReportDeferred.resolve(report);
            });

            return _ensureReportDeferred.promise;
        }

        var promises = [];

        for (var i = 0; i < changes.length; i++) {
            var change = changes[i]._id;
            promises.push(_ensureReport(change.licence_key, change.category));
        }

        return when.all(promises);
    }

    ensureProgress().then(getChanges).then(ensureReport).then(function(res) {
        progressUpdate("completed").then(function() {
            return aggregateDeferred.resolve(res);
        });
    }).otherwise(function(err) {
        progressUpdate("failed").then(function() {
            return aggregateDeferred.reject(err);
        });

    });

    return aggregateDeferred.promise;
}

function controller(startDate, endDate) {
    var controllerDeferred = when.defer();

    //make sure end date belong to same hour of start date
    if (startDate.getHours() !== endDate.getHours()) {
        endDate = new Date(startDate.getTime());
        endDate.setMinutes(59);
        endDate.setSeconds(59);
        endDate.setMilliseconds(999);
    }

    function isAggregatedBefore() {
        var isAggregatedBeforeDeferred = when.defer();

        $progress.find({
            startDate: {
                "$gte": startDate
            },
            endDate: {
                "$lt": endDate
            },
        }, function(err, result) {
            if (err || !result || result.length === 0) {
                return isAggregatedBeforeDeferred.reject(err || "no progress found");
            }
            return isAggregatedBeforeDeferred.resolve(result);
        });

        return isAggregatedBeforeDeferred.promise;
    }

    isAggregatedBefore().then(function(incomplete) { // aggregate before and there are some fails
        var promises = [];
        for (var i = 0; i < incomplete.length; i++) {
            promises.push(aggregate(incomplete.startDate, incomplete.endDate));
        }
        return controllerDeferred.resolve(when.all(promises));
    }).otherwise(function(err) { // so frist time to aggregate this
        return controllerDeferred.resolve(aggregate(startDate, endDate));
    });

    return controllerDeferred.promise;
}


module.exports = {
    init: function(conn) {
        $log = conn.model("log", logSchema, "log");
        $report = conn.model("report", reportsSchema, "report");
        $progress = conn.model("progress", progressSchema, "progress");
        return when.resolve();
    },
    aggregateLogs: controller,
    getReports: function() {
        return when.promise(function(resolve, reject) {
            $report.find({}, function(err, reports) {
                if (err) {
                    return reject(err);
                }
                return resolve(reports);
            });
        });
    },
    clearReports: function() {
        return when.all([clearReports, clearProgress]);
    },
    _insertReports: function(reports) {
        return when.promise(function(resolve, reject) {
            if (!(reports instanceof Array)) {
                reports = [reports];
            }
            $report.collection.insert(reports, function(err, docs) {
                if (err) {
                    return reject(err);
                }
                return resolve(docs.ops);
            });
        });
    }
};