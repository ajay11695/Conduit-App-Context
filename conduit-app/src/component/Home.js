import React, { useEffect, useState } from "react";
import { Hero } from "./Hero";
import Posts from "./Posts";
import { articlesURL } from "../utils/constant"
import Tags from "./Tags";
import Pagination from "./Pagination";
import FeedNav from "./FeedNav";
import Footer from "./Footer";

function Home (props){
    const [state, setState] = useState( {
        articles: null,
        articlesCount: 0,
        error: null,
        articlePerPage:10,
        activePageIndex:1,
        activeTab:'',
        activeloginTab:'yourfeed'
    });

    const fetchData=(user,limit,offset,tag)=>{
        fetch(articlesURL + `/?limit=${limit}&offset=${offset}` + (tag && `&tag=${tag}`),{
            method:"GET",
           headers:{
            "Authorization":user?`Token ${user.token}`:''
           }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            return res.json()
        })
            .then(data => {
                setState(prevState=>({
                    ...prevState,
                    articles: data.articles,
                    articlesCount: data.articlesCount
                }))
            }).catch((error) => {
                setState(prevState=>({ ...prevState,error: '!Not able fetch the article' }))
            })
    }

    const fetchAuthordata=(user)=>{
        fetch(articlesURL + `/?author=${user.username}`,{
            method:"GET",
            headers:{
                "Authorization":user?`Token ${user.token}`:''
            }
        }).then(res=>res.json()).then((data)=>{
            setState(prevState=>({
                ...prevState,
                articles: data.articles,
                articlesCount: data.articlesCount
            }))
        })

    }

    useEffect(()=> {
        const limit=state.articlePerPage
        const offset=(state.activePageIndex-1)*limit
        const tag=state.activeTab

        if(props.currentUser){
            if(state.activeloginTab==='yourfeed'){
                fetchAuthordata(props.currentUser)
            }else{
                fetchData(props.currentUser,limit,offset,tag)
            }
        }else{
            fetchData(props.currentUser,limit,offset,tag)
        }
       
      },[props.currentUser,state.activeloginTab,state.activeTab,state.activePageIndex,state.articlePerPage])

    const currentPageIndex=(index)=>{
        setState(prevState=>({...prevState,activePageIndex:index}))
    }

    const removeTab=(name)=>{
        if (props.currentUser) {
            setState(prevState=>({...prevState,activeloginTab:name,activePageIndex:1}))
        }
        setState(prevState=>({...prevState,activeTab:''}))
    }

    const addTab=(tag)=>{
        if (props.currentUser) {
            setState(prevState=>({...prevState,activeloginTab:''}))
        }
        setState(prevState=>({...prevState,activeTab:tag,activePageIndex:1}))
    }

    
        let { articles, articlesCount, error,articlePerPage ,activePageIndex,activeTab,activeloginTab} = state
        return (
            <>
                <Hero />
                <section className="container flex justify-between margin-t-2">
                    <div className="width-75">
                        <FeedNav activeTab={activeTab} activeloginTab={activeloginTab} removeTab={removeTab} currentUser={props.currentUser}/>
                        <Posts articles={articles} error={error} currentUser={props.currentUser}  setState={setState}/>
                        <Pagination articlePerPage={articlePerPage} articlesCount={articlesCount} activePageIndex={activePageIndex} currentPageIndex={currentPageIndex}/>
                    </div>
                    <Tags addTab={addTab}/>
                </section>
                {articles ? articles.length>1?<Footer/>:<div className="footer-position"><Footer/></div>:''}
            </>
        )
}

export default Home