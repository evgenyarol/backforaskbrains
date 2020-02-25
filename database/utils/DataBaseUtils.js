const mongoose = require("mongoose"),
    user = require("./UsersUtils.js");

mongoose.Promise = global.Promise;

module.exports.setUpConnection = () => {
    mongoose.connect(`mongodb://localhost/askbrains`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    });
};

module.exports.Users = user;
