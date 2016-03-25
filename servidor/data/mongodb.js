var Q = require('q');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var mongoUrl = "mongodb://localhost:27017/Eurocopa2016";

exports.ObjectId = mongodb.ObjectID;
exports.connecting = connecting;
exports.finding = finding;
exports.findingDistinct = distinct;
exports.inserting = inserting;
exports.updating = updating;
exports.aggregating = aggregating;

function connecting(mongoCol) {
	var deferred = Q.defer();
	MongoClient.connect(mongoUrl, function (err, db) {
		if (err) {
			callback2Promise(err, null, deferred);
		} else {
			callback2Promise(null, db.collection(mongoCol), deferred);
		}
	});
	return deferred.promise;
}

function finding(mongoCol, query) {
	var deferred = Q.defer();
	connecting(mongoCol)
		.then(function (colDb) {
			colDb.find(query).toArray(function (err, result) {
				callback2Promise(err, result, deferred);
			});
		})
		.fail(function (err) {
			callback2Promise(err, null, deferred);
		});
	return deferred.promise;
}

function distinct(mongoCol, query, field) {  
	var deferred = Q.defer();
	connecting(mongoCol)
		.then(function (colDb) {
			colDb.distinct(field, function(err, result){
                callback2Promise(err, result, deferred);
            });
		})
		.fail(function (err) {
			callback2Promise(err, null, deferred);
		});
	return deferred.promise;
}

function inserting(mongoCol, document) {
	var deferred = Q.defer();
	connecting(mongoCol)
		.then(function (colDb) {
			colDb.insert(document, function (err, result) {
				callback2Promise(err, result, deferred);
			});
		})
		.fail(function (err) {
			callback2Promise(err, null, deferred);
		});
	return deferred.promise;
}

function updating(mongoCol, query, document) {
	var deferred = Q.defer();
	connecting(mongoCol)
		.then(function (colDb) {
			colDb.update(query, document, function (err, result) {
				callback2Promise(err, result, deferred);
			});
		})
		.fail(function (err) {
			callback2Promise(err, null, deferred);
		});
	return deferred.promise;
}

function aggregating(mongoCol, pipeline) {
	var deferred = Q.defer();
	connecting(mongoCol)
		.then(function (colDb) {
			colDb.aggregate(pipeline, function (err, result) {
				console.log(JSON.stringify(result));
				callback2Promise(err, result, deferred);
			});
		})
		.fail(function (err) {
			callback2Promise(err, null, deferred);
		});
	return deferred.promise;
}

function callback2Promise(err, result, deferred) {
	if (err) {
		console.error(err);
		deferred.reject(err);
	} else {
		deferred.resolve(result);
	}
}

