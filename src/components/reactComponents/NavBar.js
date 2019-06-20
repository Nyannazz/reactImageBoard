import React from 'react'
import Search from './Search.js'
import {Link} from 'react-router-dom'


const NavBar = ({history,openLogSign,logOut,loggedIn,openUpload,mobileNavOpen}) => {
  const location=history.location.pathname;
  return (
      <nav className={`mainNavBar noSelect ${mobileNavOpen? 'mobileNavOpen':'mobileNavClosed'}`}> 

        <div className={'undecoratedLink centerAll pointer navItem'} onClick={openUpload}>UPLOAD</div>
        <div className={`navItem centerAll ${location==="/popular"?"active":""}`}>
          <Link className={`undecoratedLink`} to='/popular'>POPULAR</Link>
        </div>
        
        <div className={`navItem centerAll ${location==="/new"?"active":""}`}>
          <Link className={`undecoratedLink`} to='/new'>NEW</Link>
        </div>
        
        <Search history={history}/>

        {loggedIn?
          [<div key='navProfileButton' className={`navItem centerAll ${location==="/profile"?"active":""}`}>
            <Link className={`undecoratedLink`} to='/profile'>
              PROFILE
            </Link>
          </div>,
          <div key='navLogOutButton' onClick={logOut} className={`navItem centerAll logOutButton`}>
            LOG OUT
          </div>]:
          <div onClick={openLogSign} className={"navItem centerAll pointer"}>LOG IN</div>
          }
        {/* <div>SETTINGS</div> */}
      </nav>
  )
}

export default NavBar
