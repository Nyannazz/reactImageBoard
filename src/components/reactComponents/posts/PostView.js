import React, { Component } from 'react'
import PostRating from './postView/PostRating.js'
import PostComments from './postView/PostComments.js'
import PostItem from './PostItem.js';
/* import CommentForm from './postView/CommentForm.js' */
import CommentForm from './postView/CommentFormTwo.js'
import axios from 'axios';
import {Link} from 'react-router-dom'
const BASEURL=`${process.env.REACT_APP_BE_URL}`



export default class PostView extends Component {
  
  constructor(props) {
    super(props)
    /* console.log(this.props.match.params.postId) */
    this.scrollRef=React.createRef();
    this.img_url='https://img.pr0gramm.com/2019/05/15/159cd1cb97de3843.png'
    this.serverRating=0;
    this.state = {
      post: {},
      postId: this.props.match.params.postId || 0,
      favorite: false,
      vote: 0,
      rating: 0,
      prev: 0,
      next: 0
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
    const path=this.props.token? "/logged/posts/" : "/posts/";
    const headers=this.props.token?{headers:{"Authorization":`Bearer ${this.props.token}`}}:{};
    if(id){
      axios(`${BASEURL}${path}${id}`,headers)
      .then(res=>{
        const {post, prev, next}=res.data
        if(post.id || post.length>0){
          this.setState({
            post:post,
            favorite: post.users_with_favorite,
            vote:  post.vote,
            rating: post.rating,
            postId:this.props.match.params.postId,
            prev: prev,
            next: next
          })
            this.serverRating=post.rating
          }else{
            this.props.history.push('/')

          }
        }
        
      ).catch(error=>{
        if(error && error.response && error.response.status===403){
          this.props.loggedOutByServer();
        }
        this.props.history.push('/') 
      })

    }
  }

  getNextPost=(next)=>{
    if(next && next.id){
      this.getPost(next.id)
      this.props.history.push(`/post/${next.id}`) 
    }  
  }

  getPrevPost=(prev)=>{
    if(prev && prev.id){
      this.getPost(prev.id)
      this.props.history.push(`/post/${prev.id}`) 
    }
  }

  toggleFavorite=()=>{
    const id=this.state.postId;
    if(id && this.props.token){
      const headers={headers:{"Authorization":`Bearer ${this.props.token}`}};
      axios(`${BASEURL}${"/logged/favorite/"}${id}`,headers)
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

  ratePost=(vote)=>{
    const id=this.state.postId;
    if(id && this.props.token){
      const headers={headers:{"Authorization":`Bearer ${this.props.token}`}};
      const likeDislike=vote===1? "like" : "dislike";
      console.log(likeDislike)
      axios(`${BASEURL}/logged/${likeDislike}/${id}`,headers)
      .then((response)=>{
        console.log("vote"+this.state.vote, "serverrating"+this.serverRating, "staterating"+this.state.rating)
        this.setState({
          rating: (this.state.rating-this.state.vote)+response.data,
          vote: response.data

        })  
      }   
      ).catch(error=>{
        console.log(error)
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
    const {posts,openFull,pathUrl,searchByTag, history,token}=this.props;
    const currentImage=this.state.post?this.state.post.resourceurl:"";
    const postPreview=this.getPreview()
    const postIndex=postPreview[1];
/*     const nextPost=`${pathUrl}/post/${postIndex===posts.length-1?posts[postIndex].id : posts[postIndex+1].id}`;
    const prevPost=`${pathUrl}/post/${postIndex>=1?posts[postIndex-1].id : posts[0].id}` */

    return (
        <div ref={this.scrollRef} className={`postView`}>
          <section id='postFeedSmall'>
              {postPreview[0].map((post, index)=>
                <PostItem 
                  index={index} 
                  key={`preview${post.id}${index}`} 
                  post={post}
                  pathUrl={pathUrl}
                />
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
{/*             <Link to={nextPost} className={'undecoratedLink postNav navForward centerAll'}>
              <i className="material-icons">
                keyboard_arrow_right
              </i>
            </Link>
            <Link to={prevPost} className={'undecoratedLink postNav navBack centerAll'}>
              <i className="material-icons">
                keyboard_arrow_left
              </i>
            </Link> */}



            {this.state.next&&
              <div onClick={()=>this.getNextPost(this.state.next)} className={'undecoratedLink postNav navForward centerAll'}>
                <i className="material-icons">
                  keyboard_arrow_right
                </i>
              </div>
            }
            {this.state.prev&&
              <div onClick={()=>this.getNextPost(this.state.prev)} className={'undecoratedLink postNav navBack centerAll'}>
                <i className="material-icons">
                  keyboard_arrow_left
                </i>
              </div>
            }
          </div>}
          
          <PostRating 
            tags={this.state.post.tags}
            token={token}
            postId={this.state.postId}
            rating={this.state.rating}
            vote={this.state.vote}
            favorite={this.state.favorite}
            toggleFavorite={this.toggleFavorite}
            ratePost={this.ratePost}
            /* searchByTag={searchByTag} */
            history={history}
          />
          
          
          {/* <CommentForm 
            currentPost={this.state.post.id}
            refreshPost={()=>this.getPost(this.state.postId)}
            token={token}
          /> */}
          <CommentForm 
            currentPost={this.state.post.id}
            refreshPost={()=>this.getPost(this.state.postId)}
            token={token}
          />
          <PostComments 
            comments={this.state.post.comments}
            postId={this.state.postId}
          />

        </div>     
 
        
    )
  }
}
