const express = require("express");
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors")
const mongoose = require("mongoose");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = () => {
    try {
        mongoose.set('strictQuery', true);
        mongoose.connect(process.env.MONGO_URI)
        console.log('MongoDB connected!')
    } catch(e) {
        console.log(e)
        process.exit(1);
    }
}

//routes
app.use('/api/user',require('./routes/userRoutes'))
app.use('/api/vendor',require('./routes/vendorRoutes'))

app.listen(PORT, async() => {
    await connectDB();
    console.log(`Server started at ${PORT}`)
});
