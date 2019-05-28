import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import PostItem from './PostItem.js';
import CommentForm from './postView/CommentForm.js'
import axios from 'axios';




export default class PostView extends Component {
  
  constructor(props) {
    super(props)
    console.log(this.props.match.params.postId)
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.state = {
      post: {},
      postId: this.props.match.params.postId || 0,
      postFeed: []
    }
  }

  componentDidUpdate=()=>{
    if(this.props.match.params.postId!==this.state.postId){
      this.getPost(this.props.match.params.postId  || 0)
    }
  }
  componentDidMount(){
    this.getPost(this.state.postId);
    if(!this.props.simpleMode){
      //this.props.provContext.setScroll(this.scrollRef.current.getBoundingClientRect().y)  
    }
    console.log(this.props.simpleMode)
  }
  getPost=(id)=>{
    if(id){
      axios(`http://image-board.local/posts/${id}`).then(
      res=>{
        if(res.data.length>0){
          this.setState({
            post:res.data[0],
            postId:this.props.match.params.postId})}
        }
        
      ).catch(error=>console.log(error))
    }
    
  }

    
  render() {
    const {nextPost,prevPost,postList}=this.props;
    const postPreview=[...postList].slice(0,5)/* .splice(0,5)
 */    const currentImage=this.state.post?this.state.post.resourceurl:"";
    return (
  
        <div ref={this.scrollRef} className={`postView`}>
          <section id='postFeedSmall'>
              {postPreview.map((post, index)=>
                <PostItem index={index} key={index} 
                post={post}/>
                )
              }
          </section>
          <div className={'imageWrapper'}>
            <img alt='no img' src={currentImage}/>
            
            <div onClick={nextPost} className={'postNav navForward centerAll'}>
              <i class="material-icons">
                keyboard_arrow_right
              </i>
            </div>,
            <div onClick={prevPost} className={'postNav navBack centerAll'}>
              <i class="material-icons">
                keyboard_arrow_left
              </i>
            </div>
          </div>
          
          <PostRating/>
          
          
          <CommentForm></CommentForm>
          <PostComments/>

        </div>     
 
        
    )
  }
}
