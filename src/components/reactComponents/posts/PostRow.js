import React, { Component } from 'react'
import PostItem from './PostItem.js'
import PostView from './PostView.js'
import { isContext } from 'vm';
import {AppConsumer} from '../../AppContext.js'


export default class PostRow extends Component {
    constructor(props) {
      super(props)
      this.state = {
         
      }
    }
  checkOpenPost(arr,postOpen){
    let found=false;
    for(let i=0;i<arr.length;i++){
      if(arr[i].index===postOpen && arr[i].val){
        found=arr[i].val;
        break;
      }
    }
    return found;
  }  
    
  render() {
    const {openPost, postOpen,posts}=this.props;
    let viewPost=this.checkOpenPost(posts,postOpen)
    return (
      <div className={'postRow'}>
        <div className='postRowFlex'>
            {this.props.posts.map(post=>
              <PostItem openPost={openPost} postOpen={postOpen} post={post}/>
            )}
        </div>
        {viewPost&&
          <section>
            <AppConsumer>
              {context=><PostView post={viewPost} provContext={context}/>}
            </AppConsumer>
         </section>}
      </div>
    )
  }
}
