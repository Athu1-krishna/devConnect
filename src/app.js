const express = require('express');
const app = express();

const {adminAuth} = require('./middlewares/authMiddleware')
app.use("/admin", adminAuth, (req, res) => {
    res.send("data from admin")
})

app.listen(3000, ()=>{
    console.log("Server is successfully started at port 3000")
})