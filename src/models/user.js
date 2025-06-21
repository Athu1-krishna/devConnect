const mongoose = require('mongoose');
const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 50,
    },
    lastName: {
        type: String,
        maxLength: 50,
    },
    email: {
        type: String,
        lowercase: true,
        required: true,
        unique: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid email address" + value)
            }
        },
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Enter a strong password! "+ value);
            }
        }
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid!")
            }
        }
    },
    photoUrl: {
        type: String,
        default: "https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3396.jpg?semt=ais_items_boosted&w=740",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid Photo Url!");
            }
        }
    },
    about: {
        type: String,
        default: "This is a default about of the user!"
    },
    skills: {
        type: [String]
    },
},

{
    timestamps: true,
})

userSchema.methods.getJWT = async function () {
    const user = this; 
    const token = await jwt.sign({_id: user._id}, "Dev@Connect", {
        expiresIn: "7d",
    });
    return token;
}

userSchema.methods.validatePassword = async function (passwordInputByUser) {
    const user = this;
    const passwordHash = user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);
    return isPasswordValid;
}
const UserModel = mongoose.model("User",userSchema);
module.exports = UserModel;
