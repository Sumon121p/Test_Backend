const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roiInvestschema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    username:{
        type:String
    },
    paymentName: {
        type: String,
        required: true
    },
    InvestedAmount: {
        type: Number,
        required: true
    },
    paybackAmount: {
        type: Number,
    },
    Days: {
        type: Number,
    },
    paybackhistory: [{
        date: {
            type: Date,
        },
        amount: {
            type: Number
        },
        total: {
            type: Number
        }
    }],
    isapproved:{
       type:Boolean,
       default:false
    },
    transactionId:{
        type:String
       
    }


}, {
    timestamps: true
});

const roiInvestmodel = mongoose.model('roiInvest', roiInvestschema);

module.exports = roiInvestmodel;