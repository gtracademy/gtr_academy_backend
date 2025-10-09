// getting-started.js
const mongoose = require('mongoose');

main().then((res)=>{
  console.log("Connected to MongoDB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://gtracadmey_db_user:gcOkAjDF2rWC6NgZ@gtr-backend.je62wqj.mongodb.net/gtr-academy");

}