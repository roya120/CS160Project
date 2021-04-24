const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
var nodemailer = require('nodemailer');
const sendMail=require('./sendMail')
const {google} = require('googleapis')
const OAuth2 = google.auth.OAuth2


const {CLIENT_URL} = process.env

const userCtrl = {
    register: async (req,res)=>{
        try{
            const {firstname,lastname, email, password} = req.body
            if(!firstname ||!lastname || !email || !password)
                return res.status(400).json({msg: "Please fill in all fields."})

            if(!validateEmail(email))
                return res.status(400).json({msg: "Invalid email."})

            const user = await Users.findOne({email})
            if(user) return res.status(400).json({msg: "This email already exists."})

            if(password.length < 6)
                return res.status(400).json({msg: "Password must be at least 6 characters."})

                const bcrypt = require('bcrypt')
                const passwordHash = await bcrypt.hash(password, 12)

                const newUser = {
                    firstname,lastname, email, password: passwordHash
                }
                const activation_token = createActivationToken(newUser)

                const url = `${CLIENT_URL}/user/activate/${activation_token}`
                sendMail(email, url)

                console.log({activation_token})

            //console.log(newUser)
            res.json({msg:"Please check your email to activate."})
        }
        catch(err){
            return res.status(500).json({msg: err.message})
        }
    
    },
    activateEmail: async (req, res) => {
        try {
            const {activation_token} = req.body
            const user = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET)

            console.log(user)
            const {firstname,lastname, email, password} = user

            const check = await Users.findOne({email})
            if(check) return res.status(400).json({msg:"This email already exists."})

            const newUser = new Users({
                firstname,lastname, email, password
            })

            await newUser.save()

            res.json({msg: "Account has been activated!"})

        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const {email, password} = req.body
            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "This email is not registered."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Incorrect email/password. Please try again."})

            const refresh_token = createRefreshToken({id: user._id})
            
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/user/refresh_token',
                maxAge: 2*60*60 // 2hours
            })

            res.json({msg: "Login success!"})

        }

        catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    googleLogin: async (req, res) => {

        try {
            
        }
        catch(err){

        }
    }


   
}
//validate email
function validateEmail(email) {
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, {expiresIn: '5m'})
}

const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15m'})
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}



module.exports = userCtrl