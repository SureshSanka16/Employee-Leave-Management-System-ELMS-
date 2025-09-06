const mongoose=require('mongoose');
const cors=require('cors');
const dotenv=require('dotenv');
const clc=require('cli-color');
const express=require('express');
const app=express();
const adminRoutes=require('./routes/adminRoutes');
const employeeRoutes=require('./routes/employeeRoutes');
const path = require("path");

dotenv.config();
const port=process.env.PORT || 3000;


// Serve media folder
app.use("/media", express.static(path.join(__dirname, "media")));
//Built in MiddleWare
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//Third Party Middle ware
app.use(cors());


app.get('/',(req,res)=>{
    res.status(200).send("<b>Hello From Server</b>");
})

app.use('/admin',adminRoutes);
app.use('/employee',employeeRoutes);

//Connection to DataBase
mongoose.connect(process.env.MONGO_URL)
.then(()=>{
    console.log(clc.green.underline("Connected to DataBase"));
})
.catch((err)=>{
    console.log(clc.red.underline.bold(err.message));
})

//Starting the Server
app.listen(port,()=>{
    console.log(`Server Started on port ${port}`);
})