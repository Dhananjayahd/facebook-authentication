var express = require('express')
var passport = require('passport')
var strategy = require('passport-facebook').Strategy
var ejs  = require('ejs')

passport.use(new strategy({ 
    clientID: 'your id',
    clientSecret: ' your clientsecret',
    callbackURL:'http://localhost:3000/login/facebook/return'
},
function(accesstoken,refreshtoken,profile,cb){
    return cb(null ,profile)
}
))

passport.serializeUser(function(user,cb){ //inorder to give access to user since we are not using the database
    cb(null,user)
})
passport.deserializeUser(function(obj,cb){//to remove access to user 
    cb(null,obj)
})

app= express()

app.set('views',__dirname+'/views')
app.set('view engine','ejs')

app.use(require('morgan')('combined'))
app.use(require('cookie-parser')())
app.use(require('body-parser').urlencoded({extended:true}))
app.use(require('express-session')({secret:'my app',resave:true,saveUninitialized:true}))

//@route   -    GET /home
//@desc    -    a route to home page
//@access  -    PUBLIC
app.get('/',(req,res)=>{
    res.render('home',{user:req.user})
})

//@route   -    GET /login
//@desc    -    a route to login page
//@access  -    PUBLIC
app.get('/login',(req,res)=>{
    res.render('login')
})

//@route   -    GET /login/facebook
//@desc    -    a route to facebook auth
//@access  -    PUBLIC
app.get('/login/facebook',passport.authenticate('facebook'))

//@route   -    GET /login/facebook/callback
//@desc    -    a route to facebook auth
//@access  -    PUBLIC
app.get('/login/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//@route   -    GET /profile
//@desc    -    a route to profile page
//@access  -    PRIVATE
app.get('/profile',require('connect-ensure-login').ensureLoggedIn(),(req,res)=>{
    res.render('profile',{user:req.user})
})

app.listen('3000')
