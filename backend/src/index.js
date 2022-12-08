const express = require("express");
const userRoute = require("./routes/userRoute");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/user", userRoute);

app.get("/", async (req, res) => {
	res.json("twitter api back-end working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server started on port http://localhost:" + PORT);
});
