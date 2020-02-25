const db = require("./database/utils/DataBaseUtils.js");

db.setUpConnection();

module.exports = db;
