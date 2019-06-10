import React from 'react'

const PostRating = ({/* views, */tags,upvotes,/* downvotes, */favorite,toggleFavorite}) => {
  return (
    <div className={"ratings"}>
        <section>
            <div className={'centerAll pointer'}>
              <i className="material-icons">
                add
              </i>
            </div>
            <div
              className={'centerAll pointer'}>
              <i className="material-icons">
                remove
              </i>
            </div>
        </section>
        <p className={'ratingP'}>{upvotes | 0}</p>
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
        <div className={'postTags'}>
          {tags&&tags.map(tag=><p className={'tag pointer'}>{tag.name}</p>)}          
        </div>
        
      </div>
  )
}

export default PostRating
