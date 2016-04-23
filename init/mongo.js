var mongoose = require('mongoose');

module.exports = function () {
    var dbURI = process.env.OPENSHIFT_MONGODB_DB_URL;
    mongoose.connect(dbURI);
};