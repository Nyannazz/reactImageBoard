import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import CommentForm from './postView/CommentForm.js'
import axios from 'axios';


import {BoardConsumer} from '../imageBoardContext.js'


export default class PostView extends Component {
  
  constructor(props) {
    super(props)
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.state = {
      post: {},
      postId: this.props.postId
    }
  }
  /* static getDerivedStateFromProps(props,state){
    if(state.postId!==props.postId){
      return {
        postId: props.postId
      }
    }
    return null
  } */
  componentDidUpdate=()=>{
    if(this.props.postId!==this.state.postId){
      this.getPost(this.props.postId)
    }
  }
  componentDidMount(){
    this.getPost(this.props.postId);
    if(!this.props.simpleMode){
      this.props.provContext.setScroll(this.scrollRef.current.getBoundingClientRect().y)  
    }
    console.log(this.props.simpleMode)
  }
  getPost=(id)=>{
    axios(`http://image-board.local/posts/${id}`).then(
      res=>{this.setState({post:res.data[0],postId:this.props.postId})}
      ).catch(error=>console.log(error))
  }

    
  render() {
    return (
      <BoardConsumer>
        {context=>
          (<div ref={this.scrollRef} className={`postView`}>

          <img alt='no img' src={this.state.post.resourceurl}>
            
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
