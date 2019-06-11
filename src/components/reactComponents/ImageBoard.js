import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {BoardProvider} from './imageBoardContext.js'
import axios from 'axios'
import {Route, Switch} from 'react-router-dom';
const BASEURL=`${process.env.REACT_APP_BE_URL}`

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)

      this.requestModes={
        new: {path:'/posts',pathUrl: ''},
        user: {path:'/logged/user' ,pathUrl: '/profile'}
      }
      this.imageFeed={};
      this.loadingMore=false;
      this.postWidth=5;
      this.state = {
         posts:[],
         postOpen: 2,
         postOpenId: 20,
         endReached: false
         
      }
    }
    componentDidMount(){
      //after refresh token gets lost for first render so grab it here too
      let token=this.props.token;
      if(!token){
        //get token from local storage
        const stateStr=localStorage.getItem("userState")
        if(stateStr){
            token=JSON.parse(stateStr).token;
        }
      }
      this.getPosts(BASEURL+(this.requestModes[this.props.mode].path || "/posts"),token);
    }
    getPosts=(url,token)=>{
      console.log(this.props)
      const headers=token?{headers:{"Authorization":`Bearer ${token}`}}:{}
      if(url){
        this.loadingMore=true;
        axios.get(url, headers)
          .then(res=>{
          this.setState({posts:[...this.state.posts,...res.data.data]} ,()=>this.loadingMore=false)
          console.log(res.data)
          this.imageFeed=res.data;
        }).catch(err=>{
          console.log(err)
        })
      }
      if(this.imageFeed.current_page===this.imageFeed.last_page && this.state.endReached===false){
        this.setState({endReached:true})
      }
      
    }
    loadMore=()=>{
      console.log(this.imageFeed.next_page_url)
      if(!this.loadingMore){
        this.getPosts(this.imageFeed.next_page_url)

      }
    }

    
  
  render() {
    return (
      <BoardProvider value={{state:this.state,openPost:this.openPost}}>
        <Switch>
        
        <Route path={['/post/:postId','/profile/post/:postId']} render={(props)=>    
          this.state.posts.length>0&&
            <PostView 
              token={this.props.token}
              postId={this.state.postOpenId} 
              posts={this.state.posts}
              loadMore={this.loadMore}
              openFull={this.props.openFull}
              pathUrl={this.requestModes[this.props.mode].pathUrl || ""}
              {...props}
            />
          }
          />
          <Route path='/' render={(props)=>
          <div id='imageBoard' className={'imageGrid'}>
          {this.state.posts.length>0&&this.state.posts.map((post, index)=>
              <PostItem 
                index={index} 
                key={index} 
                postOpen={this.state.postOpenId} 
                post={post}
                pathUrl={this.requestModes[this.props.mode].pathUrl || ""}
              />
            )
          }
        </div>}/>
        </Switch>
      </BoardProvider>
    )
  }
}
