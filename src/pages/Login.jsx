import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../Firebase';

const Login = () => {

  const navigate = useNavigate();
  const[error, setError] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    // console.log(e.target[0].value)
    const email = e.target[0].value;
    const password = e.target[1].value;

    try{
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/")

    } catch (error){
      setError(true);
    }
      

  }
  return (
    <div className='formContainer'>
        <div className='formWrapper'>
            <span className='logo'> TalkFlow</span>
            <span className='title'> Login</span>
            {error && <span className='error'>Something went wrong</span>}
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder='email'/>
                <input type="password" placeholder='password'/>
                <button>Sign in</button>
            </form>
            <p>You don't have an account? <Link to='/register'>Register</Link></p>
        </div>
    </div>
  )
}

export default Login