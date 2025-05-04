const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect("mongodb+srv://athulkrishna0018:athulkrishna@cluster0.ei1em.mongodb.net/devConnect?retryWrites=true&w=majority&appName=Cluster0")
}

module.exports = {
    connectDB
}