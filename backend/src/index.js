const express = require("express");
const routes = require("./routes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(express.json());
app.use(cors());

app.use("/", routes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
	console.log("Server started on port http://localhost:" + PORT);
});
