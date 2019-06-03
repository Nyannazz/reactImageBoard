import React, { Component } from 'react'
import WelcomeBanner from './userPage/WelcomeBanner.js'
import CreatePost from './CreatePost.js'

export default class UserPage extends Component {
  constructor(props) {
    super(props)
    this.openUpload=this.openUpload.bind(this)
    this.state = {
       openUpload: false
    }
  }
  
  openUpload(event){
    event.preventDefault();
    this.setState({openUpload:!this.state.openUpload})
  }

  render() {
    return (
      <div id='userPage'>
        <WelcomeBanner>
          <button className={'submitButtonMain'} onClick={this.openUpload}>upload something</button>
        </WelcomeBanner>
        {this.state.openUpload&&<CreatePost/>}
        <section className={'postBoardProfile'}>
          <h1>YOUR POSTS</h1>
          {this.props.children}
        </section>
      </div>
    )
  }
}
