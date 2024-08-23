const express = require('express')//function return
const app = express();//module
app.use(express.urlencoded({extended:false}))
const mongoose = require('mongoose');
const frontedRouter = require('./routers/frontend')
const adminRouter = require('./routers/admin');
const multer = require('multer');
const session = require('express-session');
const url = 'mongodb://localhost:27017/mydb';
mongoose.connect(url).then(()=>{
    console.log('connected to database mydb')
}).catch((error)=>{
console.log("connection error",error)
});

app.use(session({
    secret:'biku',
    resave:false,
    saveUninitialized:false,
}))

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/upload');
    },
    filename:function(req,file,cb){
        cb(null,Date.now()+file.originalname)
    }
})

let upload = multer({
    storage:storage,
    limits:{files:1024*1024*7}
})

app.use('/admin',adminRouter)
app.use(frontedRouter)
app.use(express.static('public'));
app.set('view engine','ejs');

app.listen(4000);