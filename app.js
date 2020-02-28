const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Mongoose connection
const mongoose = require("mongoose");

mongoose.connect(process.env.DB_HOST, {
	useNewUrlParser: "true",
	useUnifiedTopology: true,
	useFindAndModify: false
});

mongoose.connection.on("error", err =>
	console.log("mongoose connection error:", err)
);

mongoose.connection.on("connected", (err, res) =>
	console.log("mongoose connected successfully")
);

// Routes
const pollRouter = require("./routers/poll");
app.use("/api/poll", pollRouter);

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}!`));
