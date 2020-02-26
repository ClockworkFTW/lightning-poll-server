const mongoose = require("mongoose");

const minOptions = val => val.length >= 2;

const voteSchema = new mongoose.Schema({
	_id: false,
	vote: { type: Number },
	ip: { type: String }
});

const settingsSchema = new mongoose.Schema({
	_id: false,
	expiration: { type: Number, default: 0 },
	privateLink: { type: Boolean, default: false },
	blockSameIp: { type: Boolean, default: false }
});

const pollSchema = new mongoose.Schema({
	link: { type: String },
	title: { type: String, required: true },
	category: { type: Object, required: true },
	created: { type: Date },
	options: {
		type: [{ type: String }],
		validate: [minOptions, "poll must have at least two options"]
	},
	settings: settingsSchema,
	votes: [voteSchema]
});

const Poll = mongoose.model("Poll", pollSchema);

module.exports = Poll;
