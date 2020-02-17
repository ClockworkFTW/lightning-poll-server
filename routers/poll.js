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
		const poll = new Poll(req.body);
		poll.link = uniqid();
		const newPoll = await poll.save();
		res.json(newPoll);
	} catch (error) {
		res.status(400).json({ message: "poll not created" });
	}
});

pollRouter.patch("/", async (req, res) => {
	try {
		const { link, vote } = req.body;
		const poll = await findOne({ link });
		const votes = [...poll.votes, vote];
		const updatedPoll = await Poll.findOneAndUpdate({ link }, votes);
		res.json(updatedPoll);
	} catch (error) {
		res.status(400).json({ message: "poll not updated" });
	}
});

module.exports = pollRouter;
