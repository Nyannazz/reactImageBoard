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
        <div className={'undecoratedLink centerAll pointer navItem'} onClick={this.props.openUpload}>UPLOAD</div>
        <div className={`navItem centerAll ${location==="/popular"?"active":""}`}><Link className={`undecoratedLink`} to='/popular'>POPULAR</Link></div>
        <div className={`navItem centerAll ${location==="/new"?"active":""}`}><Link className={`undecoratedLink`} to='/new'>NEW</Link></div>
        <Search/>
        {this.props.loggedIn?
          <div className={`navItem centerAll ${location==="/profile"?"active":""}`}><Link className={`undecoratedLink`} to='/profile'>PROFILE</Link></div>:
          <div onClick={this.props.openLogSign} className={"navItem centerAll pointer"}>LOG IN</div>
          }
        {/* <div>SETTINGS</div> */}
      </nav>
    )
  }
}
