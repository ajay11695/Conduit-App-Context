import React,{useEffect, useState} from "react";
import { tagsURL } from "../utils/constant";
import { Loader } from "./Loader";

function Tags (props) {
    let [state,setState]=useState({
        tags: null,
        error: null
    })

    useEffect(()=> {
        fetch(tagsURL).then(res => {
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            return res.json()
        })
            .then(data => {
                setState(prevState=>({...prevState,tags: data.tags}))
            }).catch((error) => {
                setState({ error: '!Not able fetch the tags' })
            })
    },[])

        let { tags, error } = state
        return (
            <div className="tags">
                <h1 className="margin-b-1 font-600">Popular Tags</h1>
                {error && <p>{error}</p>}
                {
                    !tags ?
                        <Loader /> :
                        tags.map(tag=>
                            <button className="tagbtn btn2" key={tag} onClick={()=>{props.addTab(tag)}}>{tag}</button>
                            )
                }
            </div>
        )

}

export default Tags