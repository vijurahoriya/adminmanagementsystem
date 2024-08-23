const router = require("express").Router();
const bcrypt = require("bcrypt");
const Adminreg = require("../models/adminreg");
const Banner = require("../models/banner");
const Services = require('../models/services');
const Testi = require('../models/testi');
const Query = require('../models/query')
const Reg = require('../models/reg')

const multer = require("multer");
const nodemailer = require("nodemailer");
let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/upload");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

let upload = multer({
  storage: storage,
  limits: { files: 1024 * 1024 * 5 },
});

// ************login handle with auth************
function handleLogin(req, res, next) {
  if (req.session.isAuth) {
    next();
  } else {
    res.redirect("/admin/");
  }
}

router.get("/", async (req, res) => {
  // res.send("jai hanuman")
  // let a = '123';
  // const converteda = await bcrypt.hash(a,10);
  // console.log("converteda",converteda)
  res.render("admin/login.ejs");
});

//********admin login work */
router.post("/login", async (req, res) => {
  // console.log(req.body)
  const { username, password } = req.body;
  const record = await Adminreg.findOne({ username: username });
  // console.log('record',record)
  if (record !== null) {
    const checkedPass = await bcrypt.compare(password, record.password);
    //    console.log("checkedPass",checkedPass)//give true
    if (checkedPass) {
      req.session.isAuth = true;
      res.redirect("/admin/dashboard");
    } else {
      res.redirect("/admin/");
    }
  } else {
    res.redirect("/admin/");
  }
});
// ************close*************


router.get("/dashboard", handleLogin, (req, res) => {
  res.render("admin/dashboard.ejs");
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/admin/");
});
//banner working*********************************
router.get("/banner", async (req, res) => {
  const record = await Banner.findOne();
  res.render("admin/banner.ejs", { record });
});

router.get("/bannerupdate/:abc", async (req, res) => {
  //    console.log(req.params.abc)
  const id = req.params.abc;
  const record = await Banner.findById(id);
  //    console.log("Banner record",record)
  res.render("admin/bannerupdate.ejs", { record });
});

router.post( "/updatebannerrecords/:xyz",
  upload.single("img"),
  async (req, res) => {
    //  console.log(req.body)
    // console.log(req.file)
    // const imgname = req.file.filename;
    const id = req.params.xyz;
    const { title, desc, ldesc } = req.body;
    if (req.file) {
      const imgname = req.file.filename;
      await Banner.findByIdAndUpdate(id, {
        title: title,
        desc: desc,
        ldesc: ldesc,
        img: imgname,
      });
    } else {
      await Banner.findByIdAndUpdate(id, {
        title: title,
        desc: desc,
        ldesc: ldesc,
      });
    }
    res.redirect("/admin/banner");
  }
);
//banner working close****************************




// ************services management start***********
router.get('/services',async(req,res)=>{
  const record = await Services.find().sort({postedDate :-1}) 
  const totalServices = await Services.countDocuments()
  const totalPublish = await Services.countDocuments({status:'publish'})
  const totalUnpublish = await Services.countDocuments({status:'unpublish'})
  res.render('admin/services.ejs',{record,totalServices,totalPublish,totalUnpublish})
})

router.get('/serviceadd',(req,res)=>{
  res.render('admin/servicesform.ejs')
})

router.post('/servicerecords',upload.single('simg'),async(req,res)=>{
  // console.log("object",req.body)
  const {stitle,sdesc,sldesc} = req.body;
  const imgname = req.file.filename;
  const record = new Services({title:stitle,desc:sdesc,img:imgname,ldesc:sldesc,status:'unpublish',postedDate : new Date()})
  await record.save();
  // console.log("services record",record)
  res.redirect('/admin/services')
})

router.get('/servicestatusupdate/:abc',async(req,res)=>{
     const id = req.params.abc;
    //  console.log("object",id)
     const record = await Services.findById(id);
    //  console.log("status record",record)
     let newStatus = null;
     if (record.status == 'unpublish') {
           newStatus = 'publish'
     } else {
        newStatus = 'unpublish'
     }
     await Services.findByIdAndUpdate(id,{status:newStatus})
     res.redirect('/admin/services')
})

router.get('/servicedelete/:id',async(req,res)=>{
      const id = req.params.id;
    await Services.findByIdAndDelete(id);
    res.redirect('/admin/services')
})

router.post('/servicesearch',async(req,res)=>{
    // console.log(req.body)
    const {search} = req.body;
    let record ;
    if(search == 'all'){
      record = await Services.find();
    }else{
      record = await Services.find({status:search}).sort({postedDate :-1})  
    } 
    // console.log("search",record)
    const totalServices = await Services.countDocuments()
    const totalPublish = await Services.countDocuments({status:'publish'})
    const totalUnpublish = await Services.countDocuments({status:'unpublish'})
   res.render('admin/services.ejs',{record,totalServices,totalPublish,totalUnpublish})
})
// ************services management end***********


//**********testinominals work start */

router.get('/testinominals',async(req,res)=>{
  const record = await Testi.find().sort({postedDate:-1});
  res.render('admin/testinominals.ejs',{record})
}) 

router.get('/testistatusupdate/:id',async(req,res)=>{
    const id = req.params.id;
    const record =  await Testi.findById(id)
    // console.log(record)
    let newStatus = null;
    if(record.status == 'unpublish'){
      newStatus = 'publish';
    }else{
      newStatus = 'unpublish' 
    }
    await Testi.findByIdAndUpdate(id,{status:newStatus})
      res.redirect('/admin/testinominals')
})

router.get('/testidelete/:id',async(req,res)=>{
     const id = req.params.id;
     await Testi.findByIdAndDelete(id) 
  res.redirect('/admin/testinominals')
})
//***********end testi************


//query start****************
router.get('/query',async(req,res)=>{
  const record = await Query.find();
  res.render('admin/query.ejs',{record})
})

router.get('/queryreply/:id',async(req,res)=>{
  const id = req.params.id;
  const record = await Query.findById(id); 
  res.render('admin/queryreplyform.ejs',{record})
})

router.post('/queryrecord/:id',upload.single('upload'),async(req,res)=>{
  // console.log(req.body)
  const id = req.params.id;
  const {emailto,emailsub,emailbody} = req.body;
// const path = req.file.path;
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    // secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "mary5@ethereal.email",
      pass: "npyrBS8SJR4uFKyvSu",
    },
  });
  
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // send mail with defined transport object
    if (req.file) {
      const path = req.file.path
      const info = await transporter.sendMail({
        from: 'ashtyn54@ethereal.email', // sender address
        to: emailto, // list of receivers
        subject: emailsub, // Subject line
        text: emailbody, // plain text body
        attachments:[{
          path:path
        }]
        // html: "<b>Hello world?</b>", // html body
      });
    } else {
      const info = await transporter.sendMail({
        from: 'ashtyn54@ethereal.email', // sender address
        to: emailto, // list of receivers
        subject: emailsub, // Subject line
        text: emailbody, // plain text body
        // html: "<b>Hello world?</b>", // html body
      });
    }
    // console.log("Message sent: %s", info.messageId);
    await Query.findByIdAndUpdate(id,{status:'read'})
    res.redirect('/admin/query')
  }
  
  main().catch(console.error);
})
////// query end ********


//*********user management */
 router.get('/users',async(req,res)=>{
   const record = await Reg.find(); 
  res.render('admin/users.ejs',{record})
 })

 router.get('/userstatusupdate/:id',async(req,res)=>{
  const id = req.params.id;
  const record = await Reg.findById(id);
  let newStatus = null;
  if(record.status == 'suspended'){
    newStatus = 'active'
  }else{
    newStatus = 'suspended'
  }
   await Reg.findByIdAndUpdate(id,{status:newStatus})
   res.redirect('/admin/users')
 })

 router.get('/userrolesupdate/:id',async(req,res)=>{
     const id = req.params.id;
     const record = await Reg.findById(id);
     let newRole = null;
     if (record.roles == 'public') {
       newRole = 'private'
     } else {
        newRole = 'public'
     }
     await Reg.findByIdAndUpdate(id,{roles:newRole})
     res.redirect('/admin/users')
 })
// user management end












// .................test ur........
router.get("/test", async (req, res) => {
  // let a = '123';
  // const converteda = await bcrypt.hash(a,10);
  // console.log("converteda",converteda);
  // const record = new  Adminreg({username:'admin',password:converteda})
  const record = new Banner({ title: "", desc: "", img: "", ldesc: "" });
  await record.save();
  // console.log("record", record);
});

module.exports = router;
