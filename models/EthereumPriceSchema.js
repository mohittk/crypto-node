const mongoose = require('mongoose');
const express = require('express');
const Schema = mongoose.Schema;

const EthereumPriceSchema = new Schema({
    price: Number,
    timestamp: { type: Date, default: Date.now }
})

module.exports = mongoose.model('EthereumPriceSchema', EthereumPriceSchema);