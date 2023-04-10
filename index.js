const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { default: axios } = require('axios');
const PORT = process.env.PORT || 5000;
require('dotenv').config();
const MONGO_URI = process.env.URI;


const transactionRoutes = require('./routes/TransRoutes');
const EthereumPriceSchema = require('./models/EthereumPriceSchema');

mongoose.connect(MONGO_URI).then(()=> {
    try{
        console.log('Database connected');
    } catch (err){
        console.log(err);
    }
})


app.use('/api', transactionRoutes);

//Get price every 10 minutes function
async function getPriceAndStore(){
    try {
        const urlData = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr`);
        // const getTimestamp = Data.now();
        const price = new EthereumPriceSchema({ price: urlData.data.ethereum.inr });
        await price.save();

        console.log(`Price stored: ${urlData.data.ethereum.inr}`);
    } catch (err){
        console.log(err);
    }
}

setInterval(getPriceAndStore, 1000 * 60 * 10);

app.listen(PORT, ()=> {
    console.log(`Listening on port ${PORT}`);
})
