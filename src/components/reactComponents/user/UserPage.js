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

  render() {
    const {history, token, fullScreenImage}=this.props;
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
            <h1 onClick={()=>this.setState({mode: "user"})} className={`toggleMyPostsView ${this.state.mode==="user"?"":"inactive"}`}>
              YOUR POSTS
            </h1>
            <h1 onClick={()=>this.setState({mode: "favorites"})} className={`toggleMyPostsView ${this.state.mode==="favorites"?"":"inactive"}`}>
              YOUR FAVORITES
            </h1>
          </div>
          {this.props.children}
          <ImageBoard 
            mode={this.state.mode} 
            pathUrl="/profile" 
            history={history} 
            token={token} 
            openFull={fullScreenImage}
          />
        </section>
      </div>
    )
  }
}
