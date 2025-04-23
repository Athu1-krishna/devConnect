const express = require('express');
const app = express();

app.use("/helo",(req, res)=>{
    res.send("hellooo")

})

app.listen(3000, ()=>{
    console.log("Server is successfully started at port 3000")
})