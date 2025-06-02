const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Email is required"]},
    image: { type: String, default: 'https://www.gravatar.com/avatar/'},
    color: { type: Number, default: 0 },
    profieSetup: { type: Boolean, default: false }, 
})

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, 10)
    next();
})

exports.User = mongoose.model('User', UserSchema)