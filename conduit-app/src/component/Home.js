import React, { useContext, useEffect, useState } from "react";
import { Hero } from "./Hero";
import Posts from "./Posts";
import { articlesURL } from "../utils/constant"
import Tags from "./Tags";
import Pagination from "./Pagination";
import FeedNav from "./FeedNav";
import Footer from "./Footer";
import { UserContext } from "./Context";

function Home() {
    let user = useContext(UserContext)

    const [state, setState] = useState({
        articles: null,
        articlesCount: 0,
        error: null,
        limit: 10,
        offset: 0,
        activeTab: user ? user.username : ''
    });


    const fetchData = (offset,limit,activeTab,user) => {
    
        fetch(`${articlesURL + '?limit=' + limit + '&offset=' + offset}${user ?
            activeTab !== '' && user.username !== activeTab ? '&tag=' + activeTab : ''
            :
            activeTab !== '' ? '&tag=' + activeTab : ''

            }${user && activeTab === user.username ? '&author=' + user.username : ''}`
            , {
                method: "GET",
                headers: {
                    "Authorization": user ? `Token ${user.token}` : ''
                }
            })
            .then(res => {
                if (!res.ok) {
                    throw new Error(res.statusText)
                }
                return res.json()
            })
            .then(data => {
                setState(prevState => ({
                    ...prevState,
                    articles: data.articles,
                    articlesCount: data.articlesCount
                }))
            }).catch((error) => {
                setState(prevState => ({ ...prevState, error: '!Not able fetch the article' }))
            })
    }


    useEffect(() => {
        fetchData(state.offset,state.limit,state.activeTab, user)

        return () => setState(prevState => ({ ...prevState, articles: null }))

    }, [user, state.activeTab, state.offset,state.limit])

    const handleCurrentPageIndex = (index) => {
        setState(prevState => ({ ...prevState, offset: (index - 1) * 10 }))
    }

    const addTab = (tag) => {
        if (tag === 'global') {
            return setState({ ...state, activeTab: '' })
        }

        setState({ ...state, activeTab: tag, offset: 0 })
    }


    let { articles, articlesCount, error, limit, offset, activeTab } = state
    return (
        <>
            <Hero />
            <section className="container flex justify-between margin-t-2">
                <div className="width-75">
                    <FeedNav activeTab={activeTab} addTab={addTab} />
                    <Posts articles={articles} error={error}  setState={setState} />
                   {articles && <Pagination limit={limit} articlesCount={articlesCount} offset={offset} handleCurrentPageIndex={handleCurrentPageIndex} />}
                </div>
                <Tags addTab={addTab} />
            </section>
            {articles ? articles.length > 1 ? <Footer /> : <div className="footer-position"><Footer /></div> : ''}
        </>
    )
}

export default Home