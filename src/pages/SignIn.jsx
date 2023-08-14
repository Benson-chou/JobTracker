import {React, useEffect} from 'react'
import {GoogleButton} from 'react-google-button'
import { UserAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const Signin = () => {
    const {googleSignIn, user} = UserAuth();
    const navigate = useNavigate();

    const handleGoogleSignIn = async () => {
        try {
            await googleSignIn();
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (user){
            navigate('/listpage')
        }
    }, [user, navigate])

  return (
    <div style={{display: 'flex',  flexDirection:'column', justifyContent:'center', alignItems:'center'}}>
      <h1 className="text-center text-3xl font-bold py-8">Sign In</h1>
      <div className="mx-w-[240px] m-auto py-4">
        <GoogleButton onClick={handleGoogleSignIn}/>
      </div>
    </div>
  )
}

export default Signin