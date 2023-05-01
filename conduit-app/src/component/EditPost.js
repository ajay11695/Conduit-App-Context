import { useState,useEffect } from "react"
import { articlesURL } from "../utils/constant"
import React from "react"
import { useNavigate } from "react-router"
import { useParams } from "react-router"
import Footer from "./Footer";

function EditPost(props) {
    const navigate=useNavigate()
    const slug=useParams().slug
    let [article, setArticle] = useState({
        title: '',
        description: '',
        body: '',
        tagList: '',
        errors:''
    })

  useEffect(()=>{
    fetch(articlesURL+`/${slug}`)
    .then(res=>res.json())
    .then(data=>{
        setArticle({
            title:data.article.title,
            description:data.article.description,
            body:data.article.body,
            tagList:data.article.tagList.join(','),
            errors:''
        })
    })
  },[slug])

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
        fetch(articlesURL+`/${slug}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                authorization:`Token ${props.user.token}`
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
                    <h1 className=" font-2 font-600 text-align margin-b-1">Edit Post</h1>
                    <p>{article.errors.title}</p>
                    <input className="formInput margin-b-1" name="title" placeholder="Article Title" type="text" onChange={handleChange} value={article.title}/>
                    <p>{article.errors.description}</p>
                    <input className="formInput margin-b-1" name="description" placeholder="What's the article about" type="text" onChange={handleChange} value={article.description}/>
                    <p>{article.errors.body}</p>
                    <textarea className="formInput margin-b-1" name="body" placeholder="Write your article" type="text" onChange={handleChange} value={article.body}/>
                    <p>{article.errors.tagList}</p>
                    <input className="formInput margin-b-1" name="tagList" placeholder="Enter tags" type="text" onChange={handleChange} value={article.tagList}/>
                    <div className="text-align-end margin-b-1">
                        <input className="formbtn" type="submit" value="Edit Post" onClick={handleSubmit}/>
                    </div>

                </form>
            </div>
            <div className="footer-position"><Footer/></div>
        </>
    )
}


export default EditPost