import React, { useState } from "react"
import validation from "../utils/validation"
import { signUpURL } from "../utils/constant"
import { useNavigate } from "react-router"
import Footer from "./Footer";

function SignUp(props){
    let navigate=useNavigate()
    let [state,setState]=useState({
        username:'',
        email:'',
        password:'',
        errors:{
            username:'',
            email:'',
            password:''
        }
    })

    const handleChange=(event)=>{
        let {name,value}=event.target
        let errors={...state.errors}
      
         validation(errors,name,value) 

         setState(prevState=>({...prevState,[name]:value,errors}))
    }

    const handleSubmit=(event)=>{
        event.preventDefault()
        let {username,email,password}=state
        fetch(signUpURL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
           body:JSON.stringify({user:{username,email,password}})
        })
        .then(res=>{
            if(!res.ok){
              return  res.json().then(({errors})=>{
                return Promise.reject(errors)
              })
            }
            return res.json()
        })
        .then(({user})=>{
            props.updateUser(user)
            setState({username:'',email:'',password:''})
            navigate('/')
        }).catch((errors)=>setState({errors}))
    }
    
    
        let {username,email,password,errors}=state
        return(
            <>
               <form className="forms" onSubmit={handleSubmit}>
                <h1 className="text-align font-2 margin-b-1 font-600">Sign up</h1>
                <p className="green text-align margin-b-1">Have an account?</p>
                <input
                 className="formInput" 
                 type="text" 
                 name='username' 
                 placeholder=" username" 
                 value={username} 
                 onChange={handleChange}
                 />
                  <p className="red margin-b-1">username {errors.username}</p>
                <input
                 className="formInput" 
                 type="email" 
                 name='email' 
                 placeholder=" Email" 
                 value={email} required 
                 onChange={handleChange}
                 />
                <p className="red margin-b-1">email {errors.email}</p>
                <input 
                className="formInput" 
                type="password" 
                name="password"
                 placeholder=" Password" 
                 value={password} required 
                 onChange={handleChange}
                 />
                <p className="red margin-b-1">{errors.password}</p>
                <div className="text-align-end">
                    <input 
                    disabled={errors.email || errors.password || errors.username} 
                    className="formbtn" 
                    type="submit" 
                    value='Sign up'/>
                </div>
               </form>
               <div className="footer-position"><Footer/></div>
            </>
        )
        
}

export default SignUp