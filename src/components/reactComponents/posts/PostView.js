import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import PostItem from './PostItem.js';
import CommentForm from './postView/CommentForm.js'
import axios from 'axios';
import {Link} from 'react-router-dom'
const BASEURL='http://image-board.local/posts';



export default class PostView extends Component {
  
  constructor(props) {
    super(props)
    console.log(this.props.match.params.postId)
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.state = {
      post: {},
      postId: this.props.match.params.postId || 0,
    }
  }

  componentDidUpdate=()=>{
    if(this.props.match.params.postId!==this.state.postId){
      this.getPost(this.props.match.params.postId  || 0)

    }
    if(this.props.match.params.postId==this.props.posts[this.props.posts.length-1].id){
      this.props.loadMore()
    }
  }
  componentDidMount(){
    this.getPost(this.state.postId);

  }
  getPost=(id)=>{
    if(id){
      axios(`${BASEURL}/${id}`).then(
      res=>{
        if(res.data.id || res.data.length>0){
          this.setState({
            post:res.data[0] || res.data,
            postId:this.props.match.params.postId})
            console.log(res.data)
          }else{
            this.props.history.push('/notfound')

          }
        }
        
      ).catch(error=>{console.log(error)
        this.props.history.push('/notfound')
      })

    }
    
  }
  getPreview=()=>{
    let postArr=[]
    const posts=this.props.posts;
    const index=posts.findIndex(post=>post.id==this.props.match.params.postId);
    if(index>=0){
    switch(index){
      case 0: 
        postArr=[...posts].slice(0,5);
        break;
      case 1:
        postArr=[...posts].slice(0,5);
        break;
      case (posts.length-1):
        postArr=[...posts].slice(posts.length-5,posts.length)
        break;
      case (posts.length-2): 
        postArr=[...posts].slice(posts.length-5,posts.length)
        break;
      default: 
        postArr=[posts[index-2],posts[index-1],posts[index],posts[index+1],posts[index+2]]
    }
       
  }
    return [postArr,index]
  }

    
  render() {
    const {nextPost,prevPost,posts,openFull}=this.props;
    const currentImage=this.state.post?this.state.post.resourceurl:"";
    const postPreview=this.getPreview()
    const postIndex=postPreview[1];
    console.log(postIndex)
    return (
        <div ref={this.scrollRef} className={`postView`}>
          <section id='postFeedSmall'>
              {postPreview[0].map((post, index)=>
                <PostItem index={index} key={index} 
                post={post}/>
                )
              }
          </section>
          {this.state.post.id&&<div className={'imageWrapper'}>
            <img alt='no img' src={currentImage}/>
            <div onClick={()=>openFull(currentImage)} className={'fullScreenButton'}>
              <i className="material-icons">
                crop_free
              </i>
            </div>
            <Link to={`/post/${postIndex===posts.length-1?posts[postIndex].id:posts[postIndex+1].id}`} className={'undecoratedLink postNav navForward centerAll'}>
              <i class="material-icons">
                keyboard_arrow_right
              </i>
            </Link>
            <Link to={`/post/${postIndex>=1?posts[postIndex-1].id:posts[0].id}`} className={'undecoratedLink postNav navBack centerAll'}>
              <i class="material-icons">
                keyboard_arrow_left
              </i>
            </Link>
          </div>}
          
          <PostRating {...this.state.post}/>
          
          
          <CommentForm currentPost={this.state.post.id}/>
          <PostComments/>

        </div>     
 
        
    )
  }
}
