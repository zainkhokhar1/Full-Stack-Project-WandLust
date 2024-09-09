const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing');

main().then(() => { console.log('Succesfully Connected to DB!') }).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '66db2cd4d4769bddecea330b' }))
    await Listing.insertMany(initdata.data);
    console.log('Data initialized');
}
initDB();
