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
      this.openPost=this.openPost.bind(this)
      this.createPostGrid=this.createPostGrid.bind(this)
      this.postWidth=5;
      this.state = {
         posts:[],
         postOpen: 2,
         postOpenId: 20,
      }
    }
    componentDidMount(){
      axios.get('http://image-board.local/posts').then(res=>{
        this.setState({posts:res.data} ,()=>console.log(this.state.posts))
      }).catch(err=>{
        console.log(err)
      })
      //this.props.history.push('/top/?id=23423')
    }
    openPost(postId){
      if(postId>=0 && postId<this.state.posts.length){
        this.setState({postOpenId: this.state.posts[postId].id,postOpen:postId},
          this.props.history.push(`/view/${this.state.posts[postId].id}`))
      }
    }
    /* createRows(rowLen){
      this.rows=[]
      this.postRowCount=0;
      for(let i=0;i<this.state.posts.length;i++){
        if(i%rowLen===0){
          let index=i;
          this.rows.push(
            <PostRow 
              scroll={this.props.scroll}
              postRowCount={this.postRowCount} 
              postOpen={this.state.postOpen}
              openPost={this.openPost} 
              posts={[
                {index:index+0 ,val:this.state.posts[index+0]},
                {index:index+1 ,val:this.state.posts[index+1]},
                {index:index+2 ,val:this.state.posts[index+2]},
                {index:index+3 ,val:this.state.posts[index+3]},
                {index:index+4 ,val:this.state.posts[index+4]},
                {index:index+5 ,val:this.state.posts[index+5]}]}
            />
          )
          this.postRowCount++
        }
      }return this.rows
    } */
    createPostGrid(post,index,postWidth){
      //console.log(index)
      let getOpenPostPos
      if(this.state.postOpen){
          getOpenPostPos=this.state.postOpen/postWidth;
          getOpenPostPos=(Math.ceil(getOpenPostPos)*postWidth)-1
          getOpenPostPos=getOpenPostPos<this.state.posts.length? getOpenPostPos : this.state.posts.length-1;
      }
      if(index===getOpenPostPos){
        return(
          [<PostItem index={index+1} key={index} 
            openPost={this.openPost} 
            postOpen={this.state.postOpen} 
            post={post}/>,
            <AppConsumer>
              {context=>
                <PostView 
                  postId={this.state.posts[this.state.postOpen-1].id} 
                  provContext={context}
                  simpleMode={this.props.simpleMode}
                />}
            </AppConsumer>]
        )
      }else{
        return(
          <PostItem index={index+1} key={index} 
            openPost={this.openPost} 
            postOpen={this.state.postOpen} 
            post={post}/>
        )
      }
    }
    
  
  render() {
    return (
      <BoardProvider value={{state:this.state,openPost:this.openPost}}>
        <div id='imageBoard' className={'imageGrid'}>
          {this.state.posts.map((post, index)=>
              <PostItem index={index} key={index} 
              openPost={this.openPost} 
              postOpen={this.state.postOpenId} 
              post={post}/>
            )
          }
        </div>
        <Route path='/view/:postId' render={(props)=>    
          <PostViewModal>
            <PostView 
              postId={this.state.postOpenId} 
              postOpen={this.state.postOpen}
              openPost={this.openPost}
              simpleMode={this.props.simpleMode}
              {...props}
            />
          </PostViewModal>}
          />
      </BoardProvider>
    )
  }
}
