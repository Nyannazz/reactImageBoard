import React from 'react'

const PostRating = ({ratePost, postId, token, history, tags, rating, favorite, toggleFavorite/* , searchByTag */}) => {
  return (
    <div className={"ratings"}>
        {token?
          <section>
              <div 
                onClick={()=>ratePost(1)} 
                className={'centerAll pointer'}>
                <i className="material-icons">
                  add
                </i>
              </div>
              <div
                onClick={()=>ratePost(0)} 
                className={'centerAll pointer'}>
                <i className="material-icons">
                  remove
                </i>
              </div>
          </section>:
          <div className='votePlaceholder'></div>
        }
        <p className={'ratingP'}>{rating | 0}</p>
        
        {token&&
          <div 
            className={'favoriteWrapper'}
            onClick={toggleFavorite}>
            {favorite?
            <i className={`material-icons on`}>
              favorite
            </i>:
            <i className={`material-icons off`}>
              favorite_border
            </i>}  
          </div>
        }
        
        <div className={'postTags'}>
          {tags&&tags.map((tag, index)=>
            <p key={`tags${postId}${index}`} onClick={()=>history.push(`/tag/${tag.name}`)} className={'tag pointer'}>{tag.name}</p>
          )}          
        </div>
        
      </div>
  )
}

export default PostRating
