const express =require('express')
const router=express.Router()
const multer =require('multer');
// const { UserController } = require('../controllers');

const uploadDestination='uploads'

const storage = multer.diskStorage({
  destination:uploadDestination,
  filename:function(req,file,cb){
    cb(null, file.originalname)
  }
})

const uploads=multer({storage:storage})

router.post('/register',(req,res)=>{
  res.send("register")
})

router.post('/login',async (req,res)=>{
  res.send("login")
})

router.get('/current',async()=>(req,res)=>{
  res.send('current')
})

router.get('/users/:id',async()=>(req,res)=>{
  res.send('getUserById')
})

router.put('/users/:id',async()=>(req,res)=>{
  res.send('updateUser')
})


module.exports=router