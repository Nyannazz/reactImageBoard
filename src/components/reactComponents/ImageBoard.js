import React, { Component } from 'react'
import PostItem from './posts/PostItem.js'
import PostView from './posts/PostView.js'
import {BoardProvider} from './imageBoardContext.js'
import {AppConsumer} from '../AppContext.js'
import axios from 'axios'
import PostViewModal from './posts/postViewModal.js';
import {Route} from 'react-router-dom';


export default class ImageBoard extends Component {
    constructor(props) {
      super(props)
      //console.log(this.props.location.search)
      //this.createRows=this.createRows.bind(this)
      this.postWidth=5;
      this.state = {
         posts:[],
         postOpen: 2,
         postOpenId: 20,
         postPreview: []
      }
    }
    componentDidMount(){
      axios.get('http://image-board.local/posts').then(res=>{
        this.setState({posts:res.data,postPreview:res.data} ,()=>console.log(this.state.posts))
      }).catch(err=>{
        console.log(err)
      })
      //this.props.history.push('/top/?id=23423')
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
        <div id='imageBoard' className={'imageGrid'}>
          {this.state.posts.map((post, index)=>
              <PostItem index={index} key={index} 
              postOpen={this.state.postOpenId} 
              post={post}/>
            )
          }
        </div>
        {<Route path='/post/:postId' render={(props)=>    
          this.state.posts.length>0&&<PostViewModal>
            <PostView 
              postId={this.state.postOpenId} 
              posts={this.state.posts}
              createPreview={this.createPreview}
              

              {...props}
            />
          </PostViewModal>}
          />}
      </BoardProvider>
    )
  }
}
