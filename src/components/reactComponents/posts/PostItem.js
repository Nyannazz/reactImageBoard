import React, { Component } from 'react'

export default class PostItem extends Component {
    constructor(props) {
      super(props)
      this.img_url='https://imag.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
      this.state = {
         open: false
      }
    }
    
  render() {
    const{post, postOpen,index}=this.props;
    return (
        <div onClick={()=>this.props.openPost(index)} className={`centerAll postItem pointer`}>
            <img alt="" src={post.thumbnail}></img>
            {post.id===postOpen&&<div className="selectedArrow"/>}
        </div>
    )
  }
}
