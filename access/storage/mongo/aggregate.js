var when = require("when");
var sequence = require("when/sequence");
var moment = require("moment");
var logSchema = require("./models/log");
var reportsSchema = require("./models/report");
var progressSchema = require("./models/progress");
var log = require("../../../log");
var $log, $report, $progress;

function removeReports() {
    var removeReportsDeferred = when.defer();
    $report.remove({}, function(err) {
        if (err) {
            return removeReportsDeferred.reject(err);
        }
        return removeReportsDeferred.resolve();
    });
    return removeReportsDeferred.promise;
}

function removeProgresses() {
    var removeProgressesDeferred = when.defer();
    $progress.remove({}, function(err) {
        if (err) {
            return removeProgressesDeferred.reject(err);
        }
        return removeProgressesDeferred.resolve();
    });
    return removeProgressesDeferred.promise;
}

function aggregate(startDate, endDate) {
    var aggregateDeferred = when.defer();

    /**
     * changes will be sinked in reports
     **/
    var __changes__ = [];

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

    function progressUpdateCompleted() {
        return when.resolve(progressUpdate("completed"));
    }

    function progressUpdateFailed() {
        return when.resolve(progressUpdate("failed"));
    }

    /**
     * return logs changes per category for licence_key
     * @return[
     *    {"_id":{"name":"integration","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1"},"count":6}
     *    {"_id":{"name":"call","licence_key":"9698c2f8-c1c2-404d-b934-7629e440c6c2"},"count":3}
     *    {"_id":{"name":"call","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1"},"count":2}
     *    {"_id":{"name":"ivr","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1"},"count":6}
     *    {"_id":{"name":"call","licence_key":"5363a776-eb69-4e5f-913c-c3dd39063ccc"},"count":10}
     *    {"_id":{"name":"call","licence_key":"bd0dfa3c-2d21-4e77-a45c-3a128f130856"},"count":6}
     *    {"_id":{"name":"call","licence_key":"6cf5a7d3-19d7-405f-84d0-fcb34da8135a"},"count":8}
     *   ]
     **/
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
                        name: "$category",
                        licence_key: "$licence_key"
                    },
                    count: {
                        "$sum": 1
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
     * @param Array changes - {name":"integration","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1","count":6}
     **/
    function ensureReport(changes) {
        function _ensureReport(category) {
            var _ensureReportDeferred = when.defer();
            var reportDate = new Date(startDate.getTime());
            reportDate.setHours(0);
            reportDate.setMinutes(0);
            reportDate.setSeconds(0);
            reportDate.setMilliseconds(0);

            $report.findOneOrCreate({
                licence_key: category.licence_key,
                category: category.name,
                datetime: {
                    "$eq": reportDate
                }
            }, {
                licence_key: category.licence_key,
                category: category.name,
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
            promises.push(_ensureReport(changes[i]));
        }

        return when.all(promises);
    }


    function updateReport(changes) {
        changes = __changes__;

        var _reportDate = new Date(startDate.getTime());
        _reportDate.setHours(0);
        _reportDate.setMinutes(0);
        _reportDate.setSeconds(0);
        _reportDate.setMilliseconds(0);


        function _updateReportCount(category) {
            var _updateReportCountDeferred = when.defer();

            function _sumHourlyCount() {
                var _sumHourlyCountDeferred = when.defer();

                $report.aggregate([{
                    $match: {
                        category: category.name,
                        licence_key: category.licence_key,
                        datetime: _reportDate
                    }
                }, {
                    $group: {
                        _id: {
                            name: "$category",
                            licence_key: "$licence_key"
                        },
                        count: {
                            "$sum": {
                                $add: [
                                    "$hourly.0", "$hourly.1", "$hourly.2", "$hourly.3", "$hourly.4",
                                    "$hourly.5", "$hourly.6", "$hourly.7", "$hourly.8", "$hourly.9",
                                    "$hourly.10", "$hourly.11", "$hourly.12", "$hourly.13", "$hourly.14",
                                    "$hourly.15", "$hourly.16", "$hourly.17", "$hourly.18", "$hourly.19",
                                    "$hourly.20", "$hourly.21", "$hourly.22", "$hourly.23"
                                ]
                            }
                        }
                    }
                }], function(err, result) {
                    if (err || !result || result.length === 0) {
                        return _sumHourlyCountDeferred.reject(err || "error while trying to sume report hours");
                    }
                    return _sumHourlyCountDeferred.resolve(result[0].count || 0);
                });
                return _sumHourlyCountDeferred.promise;
            }

            _sumHourlyCount().then(function(count) {
                $report.update({
                    licence_key: category.licence_key,
                    category: category.name,
                    datetime: _reportDate
                }, {
                    "$set": {
                        count: count
                    }
                }, function(err, report) {
                    if (err || !report || report.nModified === 0) {
                        return _updateReportCountDeferred.reject(err || "not able to update report sum count");
                    }
                    return _updateReportCountDeferred.resolve(report);
                });
            }).otherwise(function(err) {
                return _updateReportCountDeferred.reject(err || "not able to update report sum count");
            });

            return _updateReportCountDeferred.promise;
        }

        function _updateReport(category) {
            var _updateReportDeferred = when.defer();

            var setObj = {};
            setObj["hourly." + startDate.getHours()] = category.count;

            $report.update({
                licence_key: category.licence_key,
                category: category.name,
                datetime: _reportDate
            }, {
                "$set": setObj
            }, {
                upsert: true
            }, function(err, report) {
                if (err || !report || report.nModified === 0) {
                    return _updateReportDeferred.reject(err || "not able to update report per hour count");
                }
                return _updateReportDeferred.resolve(report);
            });

            return _updateReportDeferred.promise;
        }

        var promises = [];

        for (var i = 0; i < changes.length; i++) {
            promises.push(sequence([_updateReport, _updateReportCount], changes[i]));
        }

        return when.all(promises);
    }

    /**
     * convert @param changes from
     *        [
     *          {"_id":{"name":"integration","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1"},"count":6}
     *        ]
     *    to
     *        [
     *          {name":"integration","licence_key":"044b56a8-f4d6-4908-b693-9ea3f4cc19f1","count":6}
     *        ]
     **/
    function processChanges(changes) {
        var updates = [];
        changes.forEach(function(change) {
            var category = change._id;
            category.count = change.count;
            updates.push(category);
        });
        return when.resolve(updates);
    }

    ensureProgress()
        .then(getChanges).then(processChanges).then(function(changes) {
            __changes__ = changes;
            return when.resolve(changes);
        })
        .then(ensureReport).then(updateReport)
        .then(progressUpdateCompleted)
        .then(function() {
            return aggregateDeferred.resolve();
        })
        .otherwise(function(err) {
            progressUpdateFailed().then(function() {
                return aggregateDeferred.reject(err);
            }).otherwise(function(error) {
                return aggregateDeferred.reject(error + "\n" + err);
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
        return when.all([removeReports(), removeProgresses()]);
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