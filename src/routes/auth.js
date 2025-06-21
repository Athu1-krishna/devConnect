const express = require('express');
const User = require('../models/user');
const {validateSignUpData} = require('../utils/validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authRouter = express.Router();

// signup api
authRouter.post("/signup", async (req, res) => {
    
    try{
        // validate the data
        validateSignUpData(req)
        const {firstName, lastName, email,password} = req.body;
 
        // Encrypt the password
        const passwordHash = await bcrypt.hash(password, 10)
        
        // Create a user instance
        const user = new User({
            firstName,
            lastName,
            email,
            password: passwordHash
        })
        await user.save();
        res.send("signup successfully")
    }
    catch(err){
        res.status(400).send("ERROR : " + err.message)
    }
    
})

// login api
authRouter.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        const user = await User.findOne({email: email})
        console.log(user);
        
        if(!user){
            throw new Error("Invalid Credentials");
        }
        const isPasswordValid = await user.validatePassword(password)
        if(isPasswordValid){

            // Create a jwt token
            const token = await user.getJWT();
            // Add the token to cookie and send the response back to the user
            res.cookie("token", token)
            res.send("Login Successful")
        }else{
            throw new Error("Invalid Credentials")
        }
    }
    catch(err){
        res.status(400).send("ERR : "+ err.message)
    }
}) 

// logout api
authRouter.post('/logout', async (req, res) => {
    res.cookie('token', null, { expires: new Date(Date.now())});
    res.send('Logout successful!')
})


module.exports = authRouter;