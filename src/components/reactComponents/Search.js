import React, { Component } from 'react'

export default class Search extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         search: ''
      }
    }
  
    onChange=(event)=>{
      const name=event.target.name;
      const value=event.target.value;

      this.setState({[name]:value})
    }
    
  render() {
    let searchActive=this.state.search.length>0? 'searchActive' : ''
    return (
      <form className={`searchComp centerAll  ${searchActive}`}>
        <input name='search' onChange={this.onChange} value={this.state.search} className='searchInput' type='text'></input>
        <input id='searchBarSubmit' className={'searchSubmit centerAll'} type='submit'/>
        <label htmlFor='searchBarSubmit'>
          <i class="material-icons">
            youtube_searched_for
          </i>
        </label>
      </form>
    )
  }
}
