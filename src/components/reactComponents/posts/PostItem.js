import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class PostItem extends Component {
    constructor(props) {
      super(props)
      this.img_url='https://imag.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
      this.state = {
         open: false
      }
    }
    
  render() {
    const{post, postOpen,pathUrl}=this.props;
    return (
        <Link to={`${pathUrl}/post/${post.id || 0}`} className={`centerAll postItem pointer`}>
            <img alt="" src={post.thumbnail}></img>
            {post.id===postOpen&&<div className="selectedArrow"/>}
        </Link>
    )
  }
}
