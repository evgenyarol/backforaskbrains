const mongoose = require("mongoose");

const Schema = mongoose.Schema;

/* 
socialLinks = [
	{
		name: 'LinkedIn',
		link: 'https://linkedin.com/test'
	},
	{
		name: 'Facebook',
		link: 'https://facebook.com/test'
	}
] 
*/

const UserSchema = new Schema({
    login: { type: String, unique: true },
    password: { type: String },
    name: { type: String },
    surname: { type: String },
    about: { type: String },
    keywords: { type: Array },
    balance: { type: Object },
    role: { type: String }, // USER, EXPERT
    available: { type: Boolean },
    createdAt: { type: Date },
    expertType: { type: Array },
    biography: { type: String },
    socialLinks: { type: Array },
    rate: { type: Number },
    currency: { type: String },
    picture: { type: String }
});

const User = mongoose.model("Users", UserSchema);

module.exports = User;
