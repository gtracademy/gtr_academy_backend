// getting-started.js
const mongoose = require('mongoose');

main().then((res)=>{
  console.log("Connected to MongoDB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGO_URI);

}