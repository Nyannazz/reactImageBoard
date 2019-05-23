import React, { Component } from 'react'
import Search from './Search.js'

export default class NavBar extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         
      }
    }
    
  render() {
    return (
      <nav className={'mainNavBar'}> 
        <Search/>
      </nav>
    )
  }
}
