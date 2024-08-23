const router = require('express').Router();
const multer = require('multer');
const Banner = require('../models/banner');
const Services = require('../models/services');
const Testi = require('../models/testi');
const Query = require('../models/query')
const Reg = require('../models/reg');
const { check, validationResult } = require('express-validator');
//middleware for session manage
function handleLogin(req,res,next){
  if (req.session.isAuth) {
      return next();
  } else {
    res.redirect('/login')
  }
}
 //middelware for role assign
 function handleRoles(req,res,next){
  if(sess.roles =='private'){
   return next();
  }
  else{
        res.send('You do not have to see this page ')
  }
 }


// creating a session variable
let sess = null;

let storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/upload')
    },
    filename:function(req,file,cb) {
        cb(null,Date.now()+file.originalname);
    }
})

let upload= multer({
    storage:storage,
    limits:{files:1024*1024*6}
})

//**********forntend banner*********
router.get('/',handleLogin,async(req,res)=>{
    // res.send("jai shree ram");
    const record = await Banner.findOne();
    const serviceRecord = await Services.find({status:'publish'});
    const testirecord = await Testi.find({status:'publish'})
    if (sess !== null) {
        res.render('index.ejs',{record,serviceRecord,testirecord,username:sess.username}); 
    }else{
        res.render('index.ejs',{record,serviceRecord,testirecord,username:'hello'});
    }
   
})

router.get('/banner',handleLogin,async(req,res)=>{
    const record = await Banner.findOne();
    if (sess !== null) {
        res.render('banner.ejs',{record,username:sess.username})
    } else {
        res.render('banner.ejs',{record,username:'hello'})
    }
})

router.get('/moreservices/:id',handleLogin,async(re,res)=>{
    const id = req.params.id;
    const record = await Services.findById(id);
    if (sess !== null) {
        res.render('services.ejs',{record,username:sess.username}) 
    }else{
        res.render('services.ejs',{record,username:'hello'}) 
    }
})
//********* close*/

//************testinominals work */
router.get('/testi',handleRoles,(req,res)=>{
    if(sess !== null){
        res.render('testi.ejs',{username:sess.username})
    }else{
        res.render('testi.ejs',{username:'hello'})
    }
     
})
router.post('/testirecords',upload.single('timg'),async(req,res)=>{
    // console.log(req.body)
    const {quote,cname} = req.body;
    const imgname = req.file.filename;
    const record = new Testi({ img:imgname,quote:quote,company:cname,status:'unpublish', postedDate:new Date()})
    await record.save();
    // console.log("testi record",record)
     res.redirect('/')
})

//********testi closed */


// query work start***************
router.post('/queryrecord',async(req,res)=>{
   console.log(req.body);
   const {email,query} = req.body;
   const record = new Query({email:email,query:query,status:'unread'});
   await record.save();
   console.log("record",record);
   res.redirect('/')
})


//*******user registration */
router.get('/reg',(req,res)=>{
    if(sess !== null){
        res.render('reg.ejs',{username:sess.username, errors: null })
    }else{
        res.render('reg.ejs',{username:'hello', errors: null })
    }
 
})
router.post('/regrecords',[
    check('us').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    // check('email').isEmail().withMessage('Invalid email'),
    check('pass').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
],async(req,res)=>{
    // console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // return res.status(400).json({ errors: errors.array() });
        return res.render('reg.ejs', { username:'hello',errors: errors.array() });
    }
    const {us,pass} = req.body;
    const userCheck = await Reg.findOne({username:us})
    if (userCheck == null) {
        const record = new Reg({username:us,password:pass,firstname:'',lastname:'',email:'',image:'',status:'suspended',roles:'public'})
        await record.save();
        // console.log("regrecord",record)
         res.redirect('/login')
    } else {
         res.redirect('/reg')
    } 
    
})
// user register end*****************\


// user login****************************
router.get('/login',(req,res)=>{
    if (sess !== null) {
        res.render('login.ejs',{username:sess.username})
    } else {
        res.render('login.ejs',{username:'hello'})   
    }
 
})
router.post('/loginrecords',async(req,res)=>{
    // console.log(req.body);
    const {username,pass} = req.body;
    const record = await Reg.findOne({username:username})
    if (record !== null) {
        if(record.password == pass){
            if (record.status == 'active') {
                req.session.isAuth = true;
                //   sess varibale ko reasign krke value store krna/
                sess = req.session;
                sess.username=username;
                //roles assign krna in session variable
                sess.roles = record.roles
                res.redirect('/')
            } else {
                res.send('Your Account is suspended.Please Contact Your Admin')
            }
        }else{
            res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})
//login user work end****************

//profile work
router.get('/profile',async(req,res)=>{
    if(sess !== null){
        //profile update ke liye phle ka data dikhna
        const record =  await Reg.findOne({username:sess.username}) 
        console.log("profile",record)
        res.render('profile.ejs',{record,username:sess.username})
    }
    else{
        res.render('profile.ejs',{username:'hello'})
    }
})
router.post('/profilerecords/:id',upload.single('img'),async(req,res)=>{
    // console.log(req.body)
    const id = req.params.id;
    const {fname,lname,email} = req.body;
    if(req.file){
        const filename = req.file.filename
        await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,email:email,image:filename}) 
    }
    await Reg.findByIdAndUpdate(id,{firstname:fname,lastname:lname,email:email,image:'serv.jpg'}) 
    res.redirect('/profile')
})

// user change password***************
router.get('/changepassword',(req,res)=>{
    if(sess !== null){
        res.render('changepassword.ejs',{username:sess.username})
    }else{
        res.render('changepassword.ejs',{username:'hello'})
    }

})
router.post('/changepasswordrecord',async(req,res)=>{
    // console.log(req.body)
    const {cpass,npass,confirmpass} = req.body;
    if (sess.username !== null) {
        const record = await Reg.findOne({username:sess.username})
          const id = record.id;
        if (record.password == cpass) {
            if (npass !== confirmpass ) {
                 res.send('new password and confirm password not matched')
            }
            await Reg.findByIdAndUpdate(id,{password:npass})
            return res.redirect('/changepassword')
        }else{
            return res.send('current password is not matched')
        }
    }
})
router.get('/logout',(req,res)=>{
    req.session.destroy();
    sess = null;
    res.redirect('/login')
})

module.exports = router;