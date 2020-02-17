const express = require("express");
const pollRouter = express.Router();
const uniqid = require("uniqid");

const Poll = require("../models/poll");

pollRouter.get("/", async (req, res) => {
	try {
		const polls = await Poll.find();
		res.json(polls);
	} catch (error) {
		res.status(400).json({ message: "polls not found" });
	}
});

pollRouter.post("/", async (req, res) => {
	try {
		const { title, options } = req.body;
		console.log(title, options);
		const poll = new Poll({
			title,
			options,
			votes: new Array(options.length).fill(0)
		});
		poll.link = uniqid();
		const newPoll = await poll.save();
		res.json(newPoll);
	} catch (error) {
		res.status(400).json({ message: "poll not created" });
	}
});

pollRouter.patch("/:link", async (req, res) => {
	try {
		const { link } = req.params;
		const poll = await Poll.findOne({ link });
		const votes = poll.votes.map((vote, i) =>
			i === req.body.vote ? vote + 1 : vote
		);
		const updatedPoll = await Poll.findOneAndUpdate(
			{ link },
			{ votes },
			{ new: true }
		);
		res.json(updatedPoll);
	} catch (error) {
		res.status(400).json({ message: "poll not updated" });
	}
});

module.exports = pollRouter;
