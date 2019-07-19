import React, { Component } from 'react'
import PostList from './posts/postList.js'
import PostView from './posts/PostView.js'
import {Route, Switch} from 'react-router-dom';

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)
      // load posts before first render
      //this.getInitialPosts();
      this.lastSearch="";
      this.lastMode="";
      this.state = {
         postOpen: 2,
         postOpenId: 20,

      }
    }


    getInitialPosts=()=>{
      if(this.props.match && this.props.match.params.search){
        this.lastSearch=this.props.match.params.search;
        this.props.getPosts(this.props.match.params.search);
        
      }
      else if(this.props.mode){
        /* console.log(this.props.mode) */
        this.props.getPosts(this.props.mode);
        this.lastMode=this.props.mode;
      }else{
        this.props.getPosts();
      }
    }
    componentDidUpdate(){
      this.refreshSearch();
      this.refreshMode();
    }
    
    refreshSearch=()=>{
      if((this.props.match && this.props.match.params.search)&&
      (this.lastSearch!==this.props.match.params.search)){

        this.lastSearch=this.props.match.params.search;
        this.props.getPosts(this.props.match.params.search);
      }
    }

    refreshMode(){
      if(this.props.mode && (this.props.mode!==this.lastMode)){
        this.lastMode=this.props.mode;
        this.props.getPosts(this.props.mode);
        console.log(this.props.mode)
      }
    }
    
  
  render() {
    const pathUrl=(this.props.pathUrl==="/tag" || this.props.pathUrl==="/search")? `${this.props.pathUrl}/${this.props.match.params.search}` : this.props.pathUrl;

    if(this.props.loading){
      /* <Loading/> */
      return <div className="innerContent">loading</div>
    }
    if(this.props.error){
      return <div className="innerContent">error!</div>
    }
    return (
        <Switch>
              

          <Route path={['/post/:postId','/profile/post/:postId','/tag/:search/post/:postId','/search/:search/post/:postId']} render={(props)=> 
           /* TODO CREATE FEED WHEN THIS IS RENDERED FIRST */
            
              <PostView
                target={this.props.target}
                imageFeedFromPostView={this.props.imageFeedFromPostView}  
                token={this.props.token}
                postId={this.state.postOpenId} 
                posts={this.props.posts}
                loadMore={this.props.loadMore}
                loadOlder={this.props.loadOlder}
                openFull={this.props.openFull}
                pathUrl={pathUrl || ""}
                loggedOutByServer={this.props.loggedOutByServer}
                /* searchByTag={this.props.getPosts} */
                {...props}
              />}
          />
          <Route path='/' render={()=>
          /* TODO MAKE THIS INTO FUNCTIONAL COMPONENT AND USE EFFECT TO GET POSTS */
              <PostList
                posts={this.props.posts}
                postOpen={this.state.postOpen}
                pathUrl={pathUrl}
                getPosts={this.getInitialPosts}
              />
            }
          />
        </Switch>
    )
  }
}
