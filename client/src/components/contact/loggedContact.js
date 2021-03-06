import React, {useState} from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import './contact.css'

function loggedContact() {
    const handleLogout = async () => {
        try {
            await axios.get('http://localhost:5000//user/logout')
            localStorage.removeItem('firstLogin')
            window.location.href = "/";
        } catch (err) {
            window.location.href = "/";
        }
      }


    return (
        <form action ="mailto:info@roya.torshizi@gmail.com" method = "POST" encType ="text/plain"> 
        <div class = "navigationBarr">
        <a href='/'>Home</a>
         <a  href='/booklist'>Library</a>
        <a href="/about">About</a>
        <a class= "LogoutLeft" href="/" onClick={handleLogout} >LogOut</a>
        </div>
            <div class="contactUs">
                <h3 class="h3Class">Contact Us</h3>
                <div>
                {/* <label> Name: </label>
                <input type="text" name="yourName" value=""/><br/> */}
                <label>Name: </label>
                <input type="text" name="yourName" value=""/><br/>
                <label>Email: </label>
                <input type="text" name="yourEmail" value=""/><br/>
                <label>Message: </label>
                <textarea name="yourMessage" rows="8" cols="65"/><br/>
                {/* <textarea name="yourMessage" rows="10" cols="30"/><br/>
                <input type="submit" name="" /> */}

    <button type="submit" class="registerbtn">send</button>
    <br></br>
    <br></br>
    <br></br>
                </div>
             
        </div>
        </form>
    )
}
export default loggedContact;