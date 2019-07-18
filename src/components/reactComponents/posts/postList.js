import React, {useEffect} from 'react'
import PostItem from './PostItem.js'


export default function ({pathUrl,postOpenId,posts, getPosts}){
    useEffect(()=>{
        getPosts()
    },[]);
    return (
        <div id='imageBoard' className={'imageGrid'}>
            {(posts && posts.length>0)&&posts.map((post, index)=>
                <PostItem 
                  index={index} 
                  key={"postItem"+index} 
                  postOpen={postOpenId} 
                  post={post}
                  pathUrl={pathUrl || ""}
                />)
            }
        </div>
    )
}

