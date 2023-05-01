import { useContext, useState } from "react"
import { articlesURL } from "../utils/constant"
import React from "react"
import { useNavigate } from "react-router"
import Footer from "./Footer";
import { UserContext } from "./Context";

function NewPost() {
    let user=useContext(UserContext)
    let navigate=useNavigate()
    let [article, setArticle] = useState({
        title: '',
        description: '',
        body: '',
        tagList: '',
        errors:''
    })

    function handleChange(event) {
        let { name, value } = event.target
        setArticle((prevState=>{
          return  {
                ...prevState,
                [name]:value,
            }
        }))
    }

    function handleSubmit(event){
        event.preventDefault()
        let {title,description,body,tagList}=article
        fetch(articlesURL,{
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                authorization:`Token ${user.token}`
            },
           body:JSON.stringify({article:{title,description,body,tagList:tagList.split(',').map(tag=>tag.trim())}})
        })
        .then(res=>{
            if(!res.ok){
                return   res.json().then(({errors})=>{
                    return Promise.reject(errors)
                })
            }
            return res.json()
        })
        .then(({article})=>{
            console.log(article)
            
            setArticle({title:'',description:'',body:'',tagList:''})
            navigate('/')
        }).catch((errors)=>setArticle((prevState=>{
            return {...prevState,errors}
        })))
    }

    return (
        <>
            <div className="container">
                <form className="forms">
                    <h1 className=" font-2 font-600 text-align margin-b-1">Add Post</h1>
                    <p>{article.errors.title}</p>
                    <input className="formInput margin-b-1" name="title" placeholder="Article Title" type="text" onChange={handleChange} />
                    <p>{article.errors.description}</p>
                    <input className="formInput margin-b-1" name="description" placeholder="What's the article about" type="text" onChange={handleChange} />
                    <p>{article.errors.body}</p>
                    <textarea className="formInput margin-b-1" name="body" placeholder="Write your article" type="text" onChange={handleChange} />
                    <p>{article.errors.tagList}</p>
                    <input className="formInput margin-b-1" name="tagList" placeholder="Enter tags" type="text" onChange={handleChange} />
                    <div className="text-align-end margin-b-1">
                        <input className="formbtn" type="submit" value="Publish Article" onClick={handleSubmit}/>
                    </div>

                </form>
            </div>
            <div className="footer-position"><Footer/></div>

        </>
    )
}


export default NewPost