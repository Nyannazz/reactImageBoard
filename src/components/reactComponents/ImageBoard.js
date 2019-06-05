import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {BoardProvider} from './imageBoardContext.js'
import axios from 'axios'
import PostViewModal from './posts/postViewModal.js';
import {Route, Switch} from 'react-router-dom';
const BASEURL=`${process.env.REACT_APP_BE_URL}`

export default class ImageBoard extends Component {
    constructor(props) {
      super(props)
      //console.log(this.props.location.search)
      //this.createRows=this.createRows.bind(this)
      this.requestModes={
        new: '/posts',
        user: '/posts/user/'
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
      this.getPosts(BASEURL+this.requestModes["new"]);
      //this.props.history.push('/top/?id=23423')
    }
    getPosts=(url,unlock)=>{
      if(url){
        this.loadingMore=true;
        axios.get(url).then(res=>{
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
/*     openPost(postId){
      if(postId>=0 && postId<this.state.posts.length){
        this.setState({postOpenId: this.state.posts[postId].id,postOpen:postId},
          this.props.history.push(`/post/${this.state.posts[postId].id}`))
      }
    } */
    
    
  
  render() {
    return (
      <BoardProvider value={{state:this.state,openPost:this.openPost}}>
        <Switch>
        
        <Route path='/post/:postId' render={(props)=>    
          this.state.posts.length>0&&
            <PostView 
              postId={this.state.postOpenId} 
              posts={this.state.posts}
              loadMore={this.loadMore}
              openFull={this.props.openFull}
              {...props}
            />
          }
          />
          <Route path='/' render={(props)=>
          <div id='imageBoard' className={'imageGrid'}>
          {this.state.posts.length>0&&this.state.posts.map((post, index)=>
              <PostItem index={index} key={index} 
              postOpen={this.state.postOpenId} 
              post={post}/>
            )
          }
        </div>}/>
          </Switch>
      </BoardProvider>
    )
  }
}
