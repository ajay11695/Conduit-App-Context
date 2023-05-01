import React, { useState } from "react"
import validation from "../utils/validation"
import { loginURL } from "../utils/constant"
import { useNavigate } from "react-router"
import Footer from "./Footer";


function SignIn (props){
    let navigate=useNavigate()
    let [state,setState]=useState({
        email:'mamaji123@gmail.com',
        password:'mamaji1234',
        errors:{
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
        let {email,password}=state
        fetch(loginURL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
           body:JSON.stringify({user:{email,password}})
        })
        .then(res=>{
            if(!res.ok){
             return   res.json().then(({errors})=>{
                    return Promise.reject(errors)
                })
            }
            return res.json()
        })
        .then(({user})=>{
            props.updateUser(user)
            setState({email:'',password:''})
            navigate('/')
        }).catch((errors)=>setState((prevState)=>{
            console.log(errors)
            return {
                ...prevState,
                errors:{
                    ...prevState.errors,
                    Err:Object.keys(errors)[0]+' '+Object.values(errors)[0]
                }
            }
        }))
    }
    
        let {email,password,errors}=state
        return(
            <>
               <form className="forms" onSubmit={handleSubmit}>
                <h1 className="text-align font-2 margin-b-1 font-600">Sign in</h1>
                <p className="green text-align margin-b-1">Need an account?</p>
                <p className="red margin-b-1">{errors.Err}</p>
                <input
                 className="formInput" 
                 type="email" 
                 name='email' 
                 placeholder=" Email" 
                 value={email} required 
                 onChange={handleChange}
                 />
                 <p className="red margin-b-1">{errors.email}</p>
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
                    disabled={errors.email || errors.password} 
                    className="formbtn" 
                    type="submit" 
                    value='Sign in'/>
                </div>
               </form>
               <div className="footer-position"><Footer/></div>
            </>
        )
        
}

export default  SignIn