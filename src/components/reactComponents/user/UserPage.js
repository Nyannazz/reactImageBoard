import React, { Component } from 'react'
import WelcomeBanner from './userPage/WelcomeBanner.js'
import CreatePost from './CreatePost.js'
import ImageBoard from '../../reactComponents/ImageBoard.js'

export default class UserPage extends Component {
  constructor(props) {
    super(props)
    this.openUpload=this.openUpload.bind(this)
    this.state = {
       openUpload: false,
       mode: "user"

    }
  }
  
  openUpload(event){
    event.preventDefault();
    this.setState({openUpload:!this.state.openUpload})
  }

  goTo=()=>{
    this.props.history.push("/profile")
  }


  render() {
    const {history, token, openFull,loadMore,posts,getUserPosts}=this.props;
    return (
      <div id='userPage'>
        <WelcomeBanner>
          <button className={'submitButtonMain'} onClick={this.openUpload}>
            upload something
          </button>
        </WelcomeBanner>
        {this.state.openUpload&&<CreatePost token={this.props.token}/>}
        <section className={'postBoardProfile'}>
          <div className={"profilePostWrapper"}>
            <h1 onClick={()=>this.setState({mode: "user"},()=>this.goTo())} className={`toggleMyPostsView pointer ${this.state.mode==="user"?"":"inactive"}`}>
              YOUR POSTS
            </h1>
            <h1 onClick={()=>this.setState({mode: "favorites"},()=>this.goTo())} className={`toggleMyPostsView pointer ${this.state.mode==="favorites"?"":"inactive"}`}>
              YOUR FAVORITES
            </h1>
          </div>
          {this.props.children}
          <ImageBoard 
            key='profileImageBoard'
            mode={this.state.mode} 
            pathUrl="/profile" 
            history={history} 
            token={token} 
            openFull={openFull}
            loadMore={loadMore} 
            posts={posts} 
            getPosts={getUserPosts} 
          />
        </section>
      </div>
    )
  }
}
