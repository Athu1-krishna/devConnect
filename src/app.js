const express = require('express');
const app = express();
const {connectDB} = require('./config/database')
const User = require('./models/user')

const {adminAuth} = require('./middlewares/authMiddleware')
app.use("/admin", adminAuth, (req, res) => {
    res.send("data from admin")
})

// signup api
app.post("/signup", async (req, res) => {
    const user = new User({
        firstName: "athul",
        lastName: "krishna",
        email: "athul@krishna.com",
        password: "athul123",
    })
    try{
        await user.save();
        res.send("signup successfully")
    }
    catch(err){
        res.status(400).send("Error saving the user...!!!")
    }
    
})

connectDB().then(()=>{
    console.log("db connection established...");
    app.listen(3000, ()=>{
    console.log("Server is successfully started at port 3000")
})
})
.catch((err)=>{
    console.log("db cannot be connected...");
    
})
