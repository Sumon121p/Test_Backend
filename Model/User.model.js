const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: [true, 'First name is required'],
        minlength: [2, 'First name must be at least 2 characters'],
        maxlength: [50, 'First name must be less than 50 characters'],
        trim: true
    },
    lastName: {
        type: String,
        required: [true, 'Last name is required'],
        minlength: [2, 'Last name must be at least 2 characters'],
        maxlength: [50, 'Last name must be less than 50 characters'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please provide a valid email address']
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username must be less than 20 characters'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters']
    },
    phoneNumber: {
        type: String,
        required: [true, 'Phone number is required'],
        length: [10, 'Phone number must be exactly 10 digits'],
        trim: true,
        match: [/^\d{10}$/, 'Phone number must be exactly 10 digits']
    },
    address: {
        street: {
            type: String,
            required: [true, 'Street address is required'],
            trim: true
        },
        city: {
            type: String,
            required: [true, 'City is required'],
            trim: true
        },
        state: {
            type: String,
            required: [true, 'State is required'],
            trim: true
        },
        zipCode: {
            type: String,
            required: [true, 'Zip code is required'],
            length: [5, 'Zip code must be exactly 5 digits'],
            match: [/^\d{5}$/, 'Zip code must be exactly 5 digits']
        }
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Date of birth is required'],
        validate: {
            validator: function(v) {
                return v <= Date.now(); 
            },
            message: 'Date of birth cannot be in the future'
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user'
    },
    profileImage: {
        type: String,
        match: [/\.(jpg|jpeg|png|gif)$/i, 'Profile image must be a valid image URL (.jpg, .jpeg, .png, .gif)']
    }
}, {
    timestamps: true 
});

userSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
