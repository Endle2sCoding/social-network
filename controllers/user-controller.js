const UserController = {
  register: async (req,res)=>{
      res.send('register')

  }, 
  login: async ()=>(req,res)=>{
      res.send('login')

  },

  current: async()=>(req,res)=>{
    res.send('current')
  },
  getUserById: async()=>(req,res)=>{
    res.send('getUserById')
  },
  updateUser: async()=>(req,res)=>{
    res.send('updateUser')
  },
  
}
module.exports=UserController