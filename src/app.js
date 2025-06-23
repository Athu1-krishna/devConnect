const express = require('express');
const app = express();
const {connectDB} = require('./config/database')
// const {adminAuth} = require('./middlewares/auth')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
app.use(express.json())
app.use(cookieParser())

app.use(authRouter);
app.use(profileRouter);
app.use(requestRouter);
app.use(userRouter);

// // feed api
// app.get('/feed', async (req, res) => {
//     try{
//         const user = await User.find({});
//         res.send(user);
//     }
//     catch(err){
//         res.status(400).send("Something went wrong...")
//     }
// })
// // get single user using email
// app.get('/user', async (req, res) => {
//     const userEmail = req.body.email;
//     try{
//         const user = await User.findOne({ email: userEmail})
//         if(!user){
//             res.status(404).send("User not found...")
//         }else{
//             res.send(user);
//         }
//     }
//     catch(err){
//         res.status(400).send("User not found....")
//     }
// })
// // delete a user by user by user id
// app.delete('/user', async (req, res) => {
//     const userId = req.body.userId
//     try{
//         const user = await User.findByIdAndDelete({_id: userId})
//         res.send("User deleted successfully...")
//     }
//     catch(err){
//         res.status(400).send("Cannot delete user...")
//     }
// })
// // update user api
// app.patch('/user', async (req, res) => {
//     const userId = req.body.userId;
//     const data = req.body;
//     try{
//         await User.findByIdAndUpdate({_id: userId}, data)
//         res.send("User updated successfully")
//     }
//     catch(err){
//         res.status(400).send("Something went wrong!!!")
//     }
// })
connectDB().then(()=>{
    console.log("db connection established...");
    app.listen(3000, ()=>{
    console.log("Server is successfully started at port 3000")
})
})
.catch((err)=>{
    console.log("db cannot be connected...");
    
})
