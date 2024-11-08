import React, { useState } from 'react'
import AddAvatar from "../img/addAvatar.png"
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {auth, db} from "../Firebase";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {


  const navigate = useNavigate();
  const[error, setError] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(e.target[0].value)
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try{
      // Step 1: Create the user in Firebase Authentication
      const res = await createUserWithEmailAndPassword(auth, email, password);

      // Step 2: Upload the avatar to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'talkflow_preset');

      const uploadResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/dibhdau39/image/upload`,
        formData
      );

      // console.log(uploadResponse);

      const downloadURL = uploadResponse.data.secure_url;


      //step3: update the user's profile in firebase auth 
      await updateProfile(res.user, {
        displayName,
        photoURL: downloadURL,
      });
      

      //step4: save the user details in firestore

      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db,"userChats", res.user.uid), {})
      navigate("/");

    } catch (error){
      setError(true);
    }
      

  }

  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'> TalkFlow</span>
            <span className='title'> Register</span>
            {error && <span className='error'>Something went wrong</span>}
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder='name'/>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password'/>
                <input type="file" style={{display:"none"}} id='file'/>
                <label htmlFor='file'>
                    <img src={AddAvatar} alt="addavatar" />
                    <span>Add an avatar</span>
                </label>
                <button>Sign up</button>
            </form>
            <p>You do have an account? <Link to='/login'>Login</Link></p>
        </div>
    </div>
  )
}

export default Register