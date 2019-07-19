import React from 'react'
import {Link} from 'react-router-dom'


const PostItem = ({post, postOpen,pathUrl}) => {
  return (
      <Link to={`${pathUrl}/post/${post.id || 0}`} className={`centerAll postItem pointer`}>
          <img alt="" src={post.thumbnail}></img>
          {post.id===postOpen&&<div className="selectedArrow"/>}
      </Link>
  )
}

export default PostItem
