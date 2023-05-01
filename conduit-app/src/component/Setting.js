import { useState } from "react"
import { useNavigate } from "react-router"
import { updateUserURL } from "../utils/constant"
import Footer from "./Footer";

function Setting(props) {
    const navigate=useNavigate()
     let [updateCurrentUser,setUpdateCurrentuser]=useState({
        image:props.user.image,
        username:props.user.username,
        email:props.user.email,
        bio:'',
        password:''})

         function handleChange(event) {
        let { name, value } = event.target
        setUpdateCurrentuser((prevState=>{
          return  {
                ...prevState,
                [name]:value,
            }
        }))
    }

     function handleSubmit(e){
        e.preventDefault()
        const { username, email, bio, image, password } = updateCurrentUser

            fetch(updateUserURL, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  authorization: `Token ${props.user.token}`,
                },
                body: JSON.stringify({
                  user: { username, email, bio, image, password },
                }),
              })
                .then((res) => {
                  if (!res.ok) {
                    return   res.json().then(({errors})=>{
                                    return Promise.reject(errors)
                                })
                  }
                  return res.json();
                })
                .then(({ user }) => {
                    props.updateUser(user)
                    navigate('/')
                }).catch(errors=>console.log(errors))
     }
    return (
        <>
            <div className="container">
                <form className="forms" onSubmit={handleSubmit}>
                    <h1 className=" font-2 font-600 text-align margin-b-1">Your Setting</h1>
                    <input className="formInput margin-b-1" name="image" placeholder="imageurl" type="text" value={updateCurrentUser.image} onChange={handleChange}/>
                    <input className="formInput margin-b-1" name="username" placeholder="username" type="text" value={updateCurrentUser.username} onChange={handleChange}/>
                    <input className="formInput margin-b-1" name="email" placeholder="email" type="email" value={updateCurrentUser.email} onChange={handleChange}/>
                    <textarea className="formInput margin-b-1" name="bio" placeholder="Short bio about you" type="text" value={updateCurrentUser.bio} onChange={handleChange}/>
                    <input className="formInput margin-b-1" name="password" placeholder="password" type="password" value={updateCurrentUser.newpassword} onChange={handleChange}/>
                    <div className="text-align-end margin-b-1">
                    <input className="formbtn" type="submit" value="update Setting" />
                    </div>

                </form>
                <hr/>
                <div className="text-align">
                    <button onClick={()=>{
                        localStorage.clear()
                        navigate("/")
                    }} className="logoutbtn font-1 red ">or click here logout</button>
                </div>
            </div>
            <div className="footer-position"><Footer/></div>
        </>
    )
}
export default Setting