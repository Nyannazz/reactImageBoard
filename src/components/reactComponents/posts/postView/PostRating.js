import React from 'react'

const PostRating = ({views,tags,upvotes,downvotes}) => {
  return (
    <div className={"ratings"}>
        <section>
            <div className={'centerAll pointer'}>
              <i className="material-icons">
                add
              </i>
            </div>
            <div className={'centerAll pointer'}>
              <i className="material-icons">
                remove
              </i>
            </div>
        </section>
        <p className={'ratingP'}>{upvotes | 0}</p>
        <div className={'postTags'}>
          {tags&&tags.map(tag=><p className={'tag pointer'}>{tag.name}</p>)}          
        </div>
      </div>
  )
}

export default PostRating
