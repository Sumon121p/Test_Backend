const express = require('express');
const { createRoiInvestment, getAllRoiInvestments, postTotalPaybackAmount, postLatestPaybackAndTotal } = require('../Controller/Roilnvest.Controller');

const router = express.Router();

router.post('/create', createRoiInvestment);

router.get('/view', getAllRoiInvestments);

router.post('/total-payback/:userId', postTotalPaybackAmount);

router.post('/latest-payback/:investmentId', postLatestPaybackAndTotal);

module.exports = router;
