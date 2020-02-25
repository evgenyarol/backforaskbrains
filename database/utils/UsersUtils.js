const mongoose = require("mongoose"),
    Users = require("../models/Users.js");

const User = mongoose.model("Users");

//----------------------------------------------------------------------------------------
// User login / { login, password }

module.exports.login = (login, password) => {
    return Users.findOne({ login: login, password: password });
};

//----------------------------------------------------------------------------------------
// Sign up new user

module.exports.create = data => {
    let user = new User({
        login: data.login,
        password: data.password,
        name: data.name || null,
        surname: data.surname || null,
        createdAt: new Date(),
        role: "null",
        available: data.available || false,
        picture: data.picture || null
    });
    let promise = user.save();
    return promise;
};

//----------------------------------------------------------------------------------------
// Search user by mail

module.exports.search = login => {
    return Users.findOne({ login: login }).select("-password");
};

//----------------------------------------------------------------------------------------
// Update user data

module.exports.update = object => {
    return Users.findOneAndUpdate({ _id: object._id }, { $set: object.action });
};

//----------------------------------------------------------------------------------------
// Get user by id

module.exports.getOneByID = id => {
    return Users.findOne({ _id: id }).select("-password");
};

//----------------------------------------------------------------------------------------
// Get all users

module.exports.getAll = () => {
    return Users.find({});
};

//----------------------------------------------------------------------------------------
// Find experts with skip and limit (pagination)

module.exports.getExperts = options => {
    console.log(options);
    if (options.from !== null && options.limit !== null) {
        return Users.find({ role: "EXPERT", available: true })
            .skip(options.from)
            .limit(options.limit);
    }
    return Users.find({ role: "EXPERT", available: true });
};

//----------------------------------------------------------------------------------------
// Insert many items for TESTS

module.exports.insertMany = array => {
    return Users.insertMany(array);
};
