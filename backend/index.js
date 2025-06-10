const express = require("express");
const cors = require("cors");
const app = express();
const db = require("./models");

var corsOptions = {
  origin: "http://localhost:5173"
};

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Tere tulemast rakendusse." });
});

require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);
require('./routes/hall.routes')(app);
require('./routes/trainer.routes')(app);
require('./routes/booking.routes')(app);
require('./routes/rating.routes')(app);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server töötab pordil ${PORT}.`);
});
