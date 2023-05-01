import { Link } from "react-router-dom"
import { Loader } from "./Loader"
import { articlesURL } from "../utils/constant"
import { useContext } from "react"
import { UserContext } from "./Context"


function Posts(props) {
    let user=useContext(UserContext)
    let { articles, error,setState } = props
    if (error) {
        return <>
            <p className=" font-1 margin-t-1">{error}</p>
        </>
    }

    if (!articles) {
        return <Loader />
    }

    if(articles.length===0){
        return <p>No Article now</p>
    }

    return (
        <>
            {articles && articles.map(article => <Article key={article.slug} {...article}  currentUser={user} setState={setState}/>)}
        </>
    )

}

function Article(props) {
    let { author, createdAt, title, description, tagList, favoritesCount, slug,favorited ,setState} = props

    const fetchFavorite=(method,slug)=>{
        fetch(articlesURL + `/${slug}/favorite`,{
            method:method,
           headers:{
            "Authorization":props.currentUser?`Token ${props.currentUser.token}`:''
           }
        }).then((res) => {
            if (!res.ok) {
                return res.json().then((error) => {
                    return Promise.reject(error)
                })
            }
            return res.json()
        }) 
        .then(({article})=>  setState((prevState) => {
            const updatedArticles = prevState.articles.map((item) => {
                if (item.slug === article.slug) {
                    return { ...item, ...article };
                } else {
                    return item;
                }
            });
            return { ...prevState, articles: updatedArticles };
        }))
    }

     const handlefavorite=(favorite,slug)=>{
        if(favorite){
            fetchFavorite('DELETE',slug)
        }else{
            fetchFavorite('POST',slug)
        }
   }
 
    return (
        <div className="article">
            <div className="flex justify-between">
                {/* got to profile */}
                <Link to={`/profiles/${author.username}`}>
                    <div className="flex">
                        <img src={author.image} alt={author.username} style={{ width: '40px', height: '40px' }} />
                        <div className="curser">
                            <h1 className="font-1 green">{author.username}</h1>
                            <p className="gray">{createdAt}</p>
                        </div>
                    </div>
                </Link>
                {/* for favorite */}
                <div onClick={()=>{ handlefavorite(favorited,slug)}}>
                    <div className={favorited?'favorite heart curser':'heart curser'} >
                        <span className="gree">&hearts;</span>
                        <span className="gree">{favoritesCount}</span>
                    </div>
                </div>
            </div>
            {/* go to single article */}
            <Link to={`/article/${slug}`}>
                <h2 className="font-1 font-600 margin-t-1 black">{title}</h2>
                <p className="gray margin-b-1">{description}</p>
                <p className="gray">Read More...</p>
            </Link>
            <div className="text-align-end">
                {tagList.map(tag => <button key={tag} className="tagbtn">{tag}</button>)}
            </div>
            <hr />
        </div>
    )
}

export default Posts