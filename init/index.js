const mongoose = require('mongoose');
const initdata = require("./data.js");
const listing = require("../models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/WanderLust"

main()
.then((res)=>{
    console.log("Db is connected");
})
.catch((err)=>{
    console.log("Error in connecting to db");
});


async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner: '68357db5bbf6afbce82b1c95'}));
    await listing.insertMany(initdata.data);
    console.log("Data was initialized");
}

initDB();