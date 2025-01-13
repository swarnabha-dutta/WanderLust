const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");




// Connect to database 
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";


main().then((req,res)=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
});



async function main() {
    await mongoose.connect(MONGO_URL);
}


const initiallizeDB = async ()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:'676e55d67f8ba9cdd6c842bb'}));
    await Listing.insertMany(initdata.data);
    console.log("data was initiallized");
}

initiallizeDB();