import React, { Component } from 'react'

export default class PostRating extends Component {
    constructor(props) {
      super(props)
    
      this.state = {
         upvotes: 0,
         downvotes: 0,
         views: 1729
      }
    }
    
  render() {
    const {upvotes,downvotes,views}=this.state;
    return (
      <div className={"ratings"}>
        <section>
            <p>+</p>
            <p>-</p>
        </section>
        <p className={'ratingP'}>{views}</p>
        <div className={'postTags'}>
          <p className='tag'>PATRICK</p>
          <p className='tag'>sponge bob</p>
          <p className='tag'>nigglet</p>
          <p className='tag'>HEY</p>
          <p className='tag'>HEY</p>
          <p className='tag'>HEY</p>
          <p className='tag'>HEY</p>
          
        </div>
      </div>
    )
  }
}
