import React from 'react'
import { useState } from 'react'
import {Input,Button,Logo} from './index.js'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth.js'
import { login } from '../features/authSlice.js'
import { Link,useNavigate } from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {  toast } from 'react-toastify';


function Login() {

  const navigate=useNavigate()
  const [error,setError]=useState("")
  const dispatch=useDispatch()
  const {register,handleSubmit}=useForm()
  
  const showSuccess= ()=>{
    toast.success("Successfully logged in",{
      position:"top-center"
    })
  }

  const userLogin= (data)=>{
    setError("")

     authService.loginUser(data).then((session)=>{
        if(session){
            showSuccess()
              authService.getCurrentUser().then((userData)=>{
                if(userData){
                    dispatch(login({userData}))
                }
                navigate('/')
            })
         
        }
    }).catch((error)=>{
        setError(error.message)
    })


  }
  return (
    <>
     <div className='flex items-center justify-center w-full'>
      <div className={`w-full max-w-lg mx-auto bg-gray-100 rounded-xl p-10 border border-black/10`}>
        <div className='mb-2 flex justify-center'>
            <span className='inline-block w-full max-w-[100px]'>
                <Logo width='100%' />
            </span>
        </div>
        <h2 className='font-bold text-2xl text-center leading-tight'>Sign in to your account</h2>
        <p className='mt-2 text-center text-base text-black/60'>
        Don&apos;t have an account?&nbsp;
        <Link to={`/signup`} 
        className='font-medium text-primary transition-all duration-200 hover:underline'>
            Sign-Up
        </Link>
        </p>
        {error&& <p className='text-red-600 mt-8 text-center'>
            {error}
            </p>}

            <form onSubmit={handleSubmit(userLogin)} className='mt-8'>
                <div className='space-y-5'>
                    <Input label="Email: "
                    placeholder="Enter your email"
                    name="email"
                    type="email"
                    {...register("email",{
                        required:true,
                        validate:{
                            matchPattern:(value)=>/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)||"Email address must be a valid address"
                        }
                    })}//its important to accees register this way since if used directly then each time its value          changes for other input tags ,the value will be overwritten each time
                    />
                    <Input label="Password: "
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    {...register("password",{
                        required:true
                    })}/>
                    <Button text="Sign in"
                    type="submit"
                    className='w-full'
                    />
                </div>
            </form>
      </div>
    </div>
    </>
   
  )
}

export default Login