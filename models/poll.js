const mongoose = require("mongoose");

const minOptions = val => val.length >= 2;

const pollSchema = new mongoose.Schema({
	link: { type: String },
	title: { type: String, required: true },
	category: { type: Object, required: true },
	expiration: { type: Date },
	author: { type: String, default: "anonymous" },
	created: { type: Date, default: new Date() },
	options: {
		type: [{ type: String }],
		validate: [minOptions, "poll must have at least two options"]
	},
	settings: { type: Object },
	votes: [{ type: Number }]
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
