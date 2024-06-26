const express = require('express');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoute');

const app = express();

connectDB();

app.use(express.json());

//Routes
app.use('/api/users', userRoutes);

app.listen(3000, ()=>{
    console.log('listening on port 3000');
});