import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import PostItem from './PostItem.js';
import CommentForm from './postView/CommentForm.js'
import axios from 'axios';
import {Link} from 'react-router-dom'
const BASEURL=`${process.env.REACT_APP_BE_URL}`



export default class PostView extends Component {
  
  constructor(props) {
    super(props)
    console.log(this.props.match.params.postId)
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.state = {
      post: {},
      postId: this.props.match.params.postId || 0,
      favorite: false
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
    console.log('called')
    const path=this.props.token? "/logged/posts/" : "/posts/";
    const headers=this.props.token?{headers:{"Authorization":`Bearer ${this.props.token}`}}:{};
    if(id){
      axios(`${BASEURL}${path}${id}`,headers)
      .then(res=>{
        if(res.data.id || res.data.length>0){
          this.setState({
            post:res.data[0] || res.data,
            favorite: res.data.users_with_favorite && res.data.users_with_favorite.length? true: false, 
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
  toggleFavorite=()=>{
    const headers={headers:{"Authorization":`Bearer ${this.props.token}`}};
    const id=this.state.postId;
    if(id && headers){
      axios(`${BASEURL}${"/favorite/"}${id}`,headers)
      .then(()=>{
        this.setState({
          favorite: !this.state.favorite
        })  
      }
        
      ).catch(error=>{
        console.log(error)
      })

    }
    
  }
/*   getPost=(id)=>{
    var xhr = new XMLHttpRequest();
xhr.open('GET', `${BASEURL}${"/logged/posts/"}${id}`, true);
xhr.setRequestHeader("Host", "image-board.local");
xhr.setRequestHeader("cookie", "imageboard_session=eyJpdiI6IjI4SkRGaE1qZnNzU3hSTEtRbjN3eFE9PSIsInZhbHVlIjoiVmlLTnBYTGVCbjJWYlpjN3IrS3ZORlF0RTVuUlljVG1TU0tUbUphQzVOeUZuc1JYQUM5VGRTY0dPZTVJRFwvdDciLCJtYWMiOiI3NGM4NzVjMTY2MTkxNDdjZjQ5NDEyOTdmMGFkNThiY2NkZTg2M2M2ODg0NWUzYzE0ZWRmN2E5ZTExZmY0YzkxIn0%3D");
xhr.withCredentials = true;
xhr.send(null);
  } */
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
          
          <PostRating 
            tags={this.state.post.tags}
            upvotes={this.state.post.upvotes}
            favorite={this.state.favorite}
            toggleFavorite={this.toggleFavorite}
          />
          
          
          <CommentForm currentPost={this.state.post.id}/>
          <PostComments comments={this.state.post.comments}/>

        </div>     
 
        
    )
  }
}
