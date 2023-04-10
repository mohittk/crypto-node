const express = require('express');
const router = express.Router();
const axios = require('axios');

const TransactionSchema = require('../models/Transaction')


router.post('/transactions/:address', async(req, res)=> {
    try {
        const address = req.params.address;
        const apiKey = process.env.API_KEY;
        const transactionUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${apiKey}`

        const getTrxs = await axios.get(transactionUrl);
        const transactionData = getTrxs.data.result;
        // console.log(getTrxs);
        if(address){
            const result = await TransactionSchema.findOne({user_address: address});
            if(result){
                result.user_transaction_data.push(...transactionData);
                await result.save();
                console.log("Existing Data Updated");
            }
            
            else{
                await TransactionSchema.insertMany({user_transaction_data:transactionData, user_address:address});
                console.log("New Data sent");
            }
        }
        res.json(address);

    } catch (err){
        console.log(err);
        res.send('Some Error occured');
    }
});

router.get('/userdata/:address', async(req, res)=> {
    try {
        const address = req.params.address;

        const getUserTransactions = await TransactionSchema.findOne({user_address:address});
        if(getUserTransactions){console.log(getUserTransactions.user_transaction_data)};

        const splitData = getUserTransactions.user_transaction_data;

        let totalBalance = 0;
        splitData.forEach(trx => {
            if(trx.to === address){
                totalBalance += Number(trx.value);
                // console.log(typeof trx.value);
            }
            else if(trx.from === address){
                totalBalance -= Number(trx.value);
                // console.log(typeof trx.value);
            }
        });
        return res.json(`Total Balance is: ${totalBalance}`);
    } catch (err){
        console.log(err);
        res.send('Failed to get user account');
    }
})

module.exports = router;