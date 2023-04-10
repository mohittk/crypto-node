const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const Transaction = new Schema({
    blockNumber: Number,
    hash: String,
    timestamp: String,
    transactionIndex: String,
    from: String,
    to: String,
    value: Number,
    gas: Number,
    gasPrice: Number,
    cummulativeGasUsed: Number,
    user_address: String,
    user_transaction_data: Array
})

module.exports = mongoose.model('Transactions', Transaction);