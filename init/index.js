const mongoose = require('mongoose');
const initData= require('./data.js');
const Listing =require('../listing.js');

const MONGO_URI = "mongodb://localhost:27017/Homyfy";

main().then(() => {
    console.log('Connected to DB');
}).catch(err => {
    console.error('Error connecting to DB:', err);  
});

async function main(){
    await mongoose.connect(MONGO_URI);
}

const initDB =async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68847f9828a33cbaf411c7e0"}))
    await Listing.insertMany(initData.data);
    console.log("data was inserted");
}