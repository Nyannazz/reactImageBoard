import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {Route, Switch} from 'react-router-dom';

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)
      this.getInitialPosts();
      this.lastSearch="";
      this.state = {
         postOpen: 2,
         postOpenId: 20,

      }
    }

    /* componentDidMount(){
      this.getInitialPosts();
    } */

    getInitialPosts=()=>{
      console.log(this.props.posts)
      if(this.props.match && this.props.match.params.search){
        this.lastSearch=this.props.match.params.search;
        this.props.getPosts(this.props.match.params.search);
      }
      else{
        this.props.getPosts();
      }
    }
    componentDidUpdate(){
      this.refreshSearch();
    }
    
    refreshSearch=()=>{
      if((this.props.match && this.props.match.params.search)&&
      (this.lastSearch!==this.props.match.params.lastSearch)){

        this.lastSearch=this.props.match.params.search;
        this.props.getPosts(this.props.match.params.search);
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
            this.props.posts.length>0&&
              <PostView 
                token={this.props.token}
                postId={this.state.postOpenId} 
                posts={this.props.posts}
                loadMore={this.props.loadMore}
                openFull={this.props.openFull}
                pathUrl={pathUrl || ""}
                /* searchByTag={this.props.getPosts} */
                {...props}
              />}
          />
          <Route path='/' render={()=>
            <div id='imageBoard' className={'imageGrid'}>
              {(this.props.posts && this.props.posts.length>0)&&this.props.posts.map((post, index)=>
                <PostItem 
                  index={index} 
                  key={"postItem"+index} 
                  postOpen={this.state.postOpenId} 
                  post={post}
                  pathUrl={pathUrl || ""}
                />)
              }
            </div>}
          />
        </Switch>
    )
  }
}
