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
		poll.created = new Date();
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

		if (!poll.settings.blockSameIp) {
			let denied = false;
			poll.votes.forEach(vote => {
				if (vote.ip === req.body.ip) {
					denied = true;
				}
			});
			if (denied) {
				return res
					.status(400)
					.json({ message: "only one vote per ip" });
			}
		}

		const votes = [...poll.votes, req.body];
		const updatedPoll = await Poll.findOneAndUpdate(
			{ link },
			{ votes },
			{ new: true }
		);

		return res.json(updatedPoll);
	} catch (error) {
		res.status(400).json({ message: "poll not updated" });
	}
});

module.exports = pollRouter;
