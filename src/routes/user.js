const express = require('express');
const { userAuth } = require('../middlewares/auth');
const userRouter = express.Router()
const ConnectionRequest = require('../models/connectionRequest')
const User = require("../models/user")
const USER_SAFE_DATA = ["firstName", "lastName", "age", "gender", "photoUrl", "about", "skills"];
// get all the pending connection request for the loggedIn user
userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user; 
        const connectionRequest = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested"
        }).populate('fromUserId', USER_SAFE_DATA);
        res.json({
            message: "Data fetched successfully!",
            data: connectionRequest
        })
    }catch(err){
        res.status(400).send("ERROR :"+ err.message);
    }
})

userRouter.get("/user/connection", userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;
        const connectionRequest = await ConnectionRequest.find({
            $or: [
                {toUserId: loggedInUser._id, status: "accepted"},
                {fromUserId: loggedInUser._id, status: "accepted"},
            ],
        })
        .populate("fromUserId", USER_SAFE_DATA)
        .populate("toUserId", USER_SAFE_DATA);

        const data = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId
        });
        res.json({data});
    }catch(err){ 
        res.status(400).send("ERROR: "+err.message );
    }
})

userRouter.get('/feed', userAuth, async (req, res) => {
    try{
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit>50? 50 : limit;
        const skip = (page-1) * limit;

        const connectionRequest = await ConnectionRequest.find({
            $or: [{fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUserFromFeed = new Set();
        connectionRequest.forEach(req=>{
            hideUserFromFeed.add(req.fromUserId._id.toString()),
            hideUserFromFeed.add(req.toUserId._id.toString())
        });

        const users = await User.find({
            $and: [
                {_id: {$nin: Array.from(hideUserFromFeed)}},
                {_id: {$ne: loggedInUser._id}}
            ]
        }).select(USER_SAFE_DATA)
        .skip(skip)
        .limit(limit);
        res.send({data: users});
    }catch(err){
        res.status(400).send("ERROR: "+err.message);
    }
})

module.exports = userRouter;