import React, { useContext, useEffect, useState } from "react"
import { articlesURL } from "../utils/constant"
import { Loader } from "./Loader"
import { Link, useNavigate, useParams } from "react-router-dom"
import { UserContext } from "./Context"

function SingleArticle() {
    let [state, setState] = useState({
        article: null,
        error: null,
        commentErr: null,
        comments: []
    })

    let slugQuery = useParams().slug
    let navigate = useNavigate()
    let user=useContext(UserContext)

    const fetchArticle = (slug) => {
        fetch(articlesURL + '/' + slug)
            .then((data) => data.json()).then((data) => {
                setState(prevState=>({...prevState, article: data.article }))
            }).catch(err => {
                setState(prevState=>({ ...prevState,error: 'Not able fetch article' }))
            })
    }

    const fetchcomment = (slug,user) => {
        fetch(articlesURL + `/${slug}/comments`, {
            method: "GET",
            headers: {
                "Authorization": user ? `Token ${user.token}` : ''
            }
        })
            .then((data) => data.json()).then((data) => {
                setState(prevState=>({...prevState, comments: data.comments }))
            }).catch(err => {
                setState(prevState=>({...prevState, commentErr: 'Not able fetch comment' }))
            })
    }

    useEffect(() => {
        fetchArticle(slugQuery)
        fetchcomment(slugQuery,user)
    }, [user,slugQuery])

    const handleComment = (e) => {
        e.preventDefault()
        const comment = e.target[0].value
        fetch(articlesURL + `/${slugQuery}/comments`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                authorization: `Token ${user.token}`
            },
            body: JSON.stringify({
                "comment": {
                    "body": comment
                }
            })
        }).then(res => res.json()).then(data => {
            fetchcomment(slugQuery,user)
            e.target[0].value = ''
        })
    }

    const deleteComment = (id) => {
        fetch(articlesURL + `/${slugQuery}/comments/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Token ${user.token}`
            },
        }).then(res => res.json()).then(data => fetchcomment(slugQuery,user)).catch(err => console.log(err))
    }

    const deletePost = () => {
        fetch(articlesURL + `/${slugQuery}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                authorization: `Token ${user.token}`
            },
        }).then(res => res.json()).then(navigate('/')).catch(err => console.log(err))
    }

    let { article, error, comments } = state
    let { author, createdAt, title, description, tagList, slug } = { ...article }
    if (error) {
        return <p className="text-align font-1 margin-t-1">{error}</p>
    }

    if (!state.article) {
        return <Loader />
    }
    return (
        <div className="container">
            {/*single article detail  */}

            <div className="singleArticle">
                <h2 className="font-2 font-600 margin-t-1 margin-b-1">{title}</h2>
                <Link to={`/profiles/${author.username}`}>
                    <div className="flex align-center article margin-b-1">
                        <img src={author.image} alt={author.username} style={{ width: '50px', height: '50px' }} />
                        <div>
                            <h1 className="font-1 green">{author.username}</h1>
                            <p className="gray">{createdAt}</p>
                        </div>
                    </div>
                </Link>
                {user && user.username === author.username &&
                    <div style={{ margin: '10px 5rem' }}>
                        <Link to={`/article/${slug}/edit`}><button className="btn2" style={{ marginRight: '1rem' }}>Edit Post</button></Link>
                        <button onClick={deletePost} className="btn2">Delete Post</button>
                    </div>
                }

            </div>
            <p className="gray margin-b-1">{description}</p>
            <div className="text-align-end">
                {tagList.map(tag => <button key={tag} className="tagbtn">{tag}</button>)}
            </div>
            <div>
                {user === null ?
                    <p className="text-align font-1 margin-t-2">
                        <Link to='signin'>SignIn</Link> or
                        <Link to='signup'> SignUp</Link> to add comments on this Article
                    </p>
                    : ''
                }
            </div>
            <hr />
            {/* comment form */}
            <div className="container2">
                {user &&
                    <form style={{ border: '1px solid gray' }} onSubmit={handleComment}>
                        <textarea name='comment' type='text' placeholder="write comment" style={{ border: 'none', height: "4rem", width: '98%' }}></textarea>
                        <div className="flex align-center justify-between" style={{ padding: '10px', background: 'rgb(218, 220, 221)' }}>
                            <div className="flex align-center" >
                                <img src={user.image} alt={user.username} style={{ width: '30px', height: '30px' }} />
                                <span>{user.username}</span>
                            </div>
                            <input className="formbtn" style={{ padding: "5px 10px" }} type="submit" value='post comment' />
                        </div>
                    </form>
                }

                {/* comment detail */}
                {comments.length > 0 &&
                    <ul className="flex column">
                        {comments.map(comment =>
                            <div key={comment.id} style={{ border: '1px solid gray', marginTop: '1rem' }}>
                                <p className="font-1" style={{ margin: '10px 5px' }}>{comment.body}</p>
                                <div className="flex align-center justify-between" style={{ padding: '10px', background: 'rgb(218, 220, 221)' }}>
                                    <div className="flex align-center" >
                                        <img src={comment.author.image} alt={comment.author.username} style={{ width: '30px', height: '30px' }} />
                                        <span>{comment.author.username}</span>
                                    </div>
                                    <i onClick={() => { deleteComment(comment.id) }} className="fa-solid fa-trash-can curser"></i>
                                </div>
                            </div>
                        )}
                    </ul>
                }
            </div>
        </div>
    )
}

export default SingleArticle