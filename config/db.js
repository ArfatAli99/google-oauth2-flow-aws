require("dotenv").config();
const mongoose = require("mongoose");

/*** environment ***/
try{
  let db;
  mongoose.connect(
    process.env.MONGO_DB_URI,
    {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
  );
  db = mongoose.connection
  // /* db.on('error', (error) => console.error(error))
  db.once('open', () => console.log("Connected to Database"));
} catch(error) {
  console.log("mongoose error =>", error);
  db = mongoose.connection
}