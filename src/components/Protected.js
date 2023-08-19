import React from 'react'
import {Navigate} from 'react-router-dom'
import {UserAuth} from '../context/AuthContext'

const Protected =({children}) => {
    const {user} = UserAuth();
    if(!user) {
        return <Navigate to="/jobtracker" />
    }

  return children
}

export default Protected