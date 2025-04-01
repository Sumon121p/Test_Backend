const roiInvestModel = require('../Model/Roilnvestschema.Model');

const createRoiInvestment = async (req, res) => {
    try {
        const {
            userId,
            username,
            paymentName,
            InvestedAmount,
            paybackAmount,
            Days,
            paybackhistory,
            isapproved,
            transactionId
        } = req.body;

        const newRoiInvestment = new roiInvestModel({
            userId,
            username,
            paymentName,
            InvestedAmount,
            paybackAmount,
            Days,
            paybackhistory,
            isapproved,
            transactionId
        });

        await newRoiInvestment.save();

        return res.status(201).json({
            message: 'ROI Investment created successfully',
            roiInvestment: newRoiInvestment
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getAllRoiInvestments = async (req, res) => {
    try {
        const roiInvestments = await roiInvestModel.find().populate('userId', 'firstName lastName email username').exec();
        return res.status(200).json({ roiInvestments });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const postTotalPaybackAmount = async (req, res) => {
    const { userId } = req.params;

    try {
        const investments = await roiInvestModel.find({ userId });

        if (!investments || investments.length === 0) {
            return res.status(404).json({ message: 'No investments found for this user.' });
        }

        let totalPaybackAmount = 0;

        investments.forEach(investment => {
            investment.paybackhistory.forEach(payback => {
                totalPaybackAmount += payback.amount;
            });
        });

        return res.status(200).json({
            userId,
            totalPaybackAmount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not calculate total payback amount.' });
    }
};

const postLatestPaybackAndTotal = async (req, res) => {
    const { investmentId } = req.params;

    try {
        const investment = await roiInvestModel.findById(investmentId);

        if (!investment) {
            return res.status(404).json({ message: 'Investment not found.' });
        }

        const latestPayback = investment.paybackhistory.sort((a, b) => b.date - a.date)[0];

        const totalPaybackAmount = investment.paybackhistory.reduce((total, payback) => {
            return total + payback.amount;
        }, 0);

        return res.status(200).json({
            investmentId,
            latestPayback,
            totalPaybackAmount
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error. Could not retrieve payback information.' });
    }
};

module.exports = {
    createRoiInvestment,
    getAllRoiInvestments,
    postTotalPaybackAmount,
    postLatestPaybackAndTotal
};
