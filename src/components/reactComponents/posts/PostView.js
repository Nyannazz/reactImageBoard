import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import CommentForm from './postView/CommentForm.js'


import {BoardConsumer} from '../imageBoardContext.js'


export default class PostView extends Component {
  constructor(props) {
    super(props)
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.state = {
    }
  }
  componentDidMount(){
    if(!this.props.simpleMode){
      this.props.provContext.setScroll(this.scrollRef.current.getBoundingClientRect().y)  
    }
    console.log(this.props.simpleMode)
  }
    
  render() {
    const {post}=this.props
    console.log(post)
    return (
      <BoardConsumer>
        {context=>
          (<div ref={this.scrollRef} className={`postView`}>

          <img src={post.resourceurl}>
            
          </img>

          <PostRating/>
          
          <div onClick={()=>context.openPost(context.state.postOpen+1)} className={'postNav navForward centerAll'}>
            <i class="material-icons">
              keyboard_arrow_right
            </i>
          </div>
          <div onClick={()=>context.openPost(context.state.postOpen-1)} className={'postNav navBack centerAll'}>
            <i class="material-icons">
              keyboard_arrow_left
            </i>
          </div>
          <CommentForm></CommentForm>
          <PostComments/>

        </div>)       
        }
      </BoardConsumer>
        
    )
  }
}
