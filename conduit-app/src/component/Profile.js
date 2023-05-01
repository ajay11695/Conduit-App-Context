import Posts from "./Posts";
import { useState ,useEffect, useContext} from "react";
import { articlesURL, getProfileURL } from "../utils/constant";
import { useParams } from "react-router";
import { Link } from "react-router-dom";
import Footer from "./Footer";
import { UserContext } from "./Context";

function Profile() {
    let [state,setState]=useState({
        articles:null,
        activeTab:'author',
        profile:''
    })
    let user=useContext(UserContext)
    let username=useParams().username

    function fetchData(activeTab,username,user){
        fetch(articlesURL + `/?${activeTab}=${username}`,{
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
               setState(prevState=>({...prevState,articles:data.articles}))
            }).catch((error) => {
                console.log(error)
            })
    }

    const fetchprofile=(username,user)=>{
        fetch(getProfileURL + username,{
            method:"GET",
                headers:{
                 "Authorization":user?`Token ${user.token}`:''
                }
        }).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            return res.json()
        })
            .then(data => {
                setState(prevState=>({...prevState,profile:data.profile}))
            }).catch((error) => {
                console.log(error)
            })
    }

    const fetchFollow=(username,method,user)=>{
        fetch(getProfileURL + username+'/follow',{
            method:method,
            headers:{
             "Authorization":user?`Token ${user.token}`:''
            }
        }).then(()=>fetchprofile(username,user))
    }

    useEffect(()=>{
        fetchData(state.activeTab,username,user)
        fetchprofile(username,user)
    },[state.activeTab,user,username])

    function handleTab(tab){
        setState(prevState=>({...prevState,activeTab:tab}))
    }

    function handleFollow(following){
         if(following){
           fetchFollow(username,'DELETE',user)
         }else{
            fetchFollow(username,'POST',user)
         }
    }

    let {articles,activeTab,profile}=state
    return (
        <div >
            <div className="flex column justify-center align-center profileHeader">
                <img src={profile.image} alt='user' />
                <h1 className="font-2 font-600 margin-t-1">{profile.username}</h1>
                {user && user.username===username?
                <Link to='/setting'><span className=" profileFollow margin-t-2 "><i className="fa-solid fa-gear"></i> Edit Profile Setting</span></Link>
                :
                <span onClick={()=>{handleFollow(profile.following)}} className=" profileFollow margin-t-2 curser"><strong className="font-1 font-600">{profile.following?'Unfollow':'Follow' } </strong> ({profile.username})</span>
            }
            </div>
            <div className="container">
                <nav className="profileNav">
                    <a href='#a' onClick={()=>{handleTab('author')}} className={activeTab === 'author' ? 'activeTab' : ''}>My Article</a>
                    <a href='#a' onClick={()=>{handleTab('favorited')}} className={activeTab === 'favorited' ? 'activeTab' : ''}>Favorite Article</a>
                    <hr />
                </nav>
                {articles===null ? <h1>No Article Found</h1> : <Posts articles={articles} currentUser={user} setState={setState}/>}
            </div>
                {articles ? articles.length>1?<Footer/>:<div className="footer-position"><Footer/></div>:''}
        </div>
    )
}

export default Profile