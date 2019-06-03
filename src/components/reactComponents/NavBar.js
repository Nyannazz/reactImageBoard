import React, { Component } from 'react'
import Search from './Search.js'
import {Link} from 'react-router-dom'

export default class NavBar extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
  render() {
    const location=this.props.location.pathname;
    return (
      <nav className={'mainNavBar noSelect'}> 
        <div className={'undecoratedLink pointer'} onClick={this.props.openUpload}>UPLOAD</div>
        <Link className={`undecoratedLink ${location==="/popular"?"active":""}`} to='/popular'>POPULAR</Link>
        <Link className={`undecoratedLink ${location==="/new"?"active":""}`} to='/new'>NEW</Link>
        <Search/>
        <Link className={`undecoratedLink ${location==="/profile"?"active":""}`} to='/profile'>PROFILE</Link>
        <div>SETTINGS</div>
      </nav>
    )
  }
}
