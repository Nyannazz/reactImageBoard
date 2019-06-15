import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {Route, Switch} from 'react-router-dom';

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)

      this.state = {
         postOpen: 2,
         postOpenId: 20,

      }
    }

    componentDidMount(){
      this.getInitialPosts();
    }

    getInitialPosts=()=>{
      console.log(this.props.posts)
      if(this.props.match && this.props.match.params.tagname){
        this.props.getPosts(this.props.match.params.tagname);
      }
      else{
        this.props.getPosts();
      }
    }
    
  
  render() {
    const pathUrl=this.props.pathUrl==="/tag"? `/tag/${this.props.match.params.tagname}` : this.props.pathUrl;

    if(this.props.loading){
      /* <Loading/> */
      return <div className="innerContent">loading</div>;
    }
    if(this.props.error){
      return <div className="innerContent">error!</div>
    }

    return (
        <Switch>
          <Route path={['/post/:postId','/profile/post/:postId','/tag/:tagname/post/:postId']} render={(props)=>    
            this.props.posts.length>0&&
              <PostView 
                token={this.props.token}
                postId={this.state.postOpenId} 
                posts={this.props.posts}
                loadMore={this.props.loadMore}
                openFull={this.props.openFull}
                pathUrl={pathUrl || ""}
                searchByTag={this.props.searchByTag}
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
