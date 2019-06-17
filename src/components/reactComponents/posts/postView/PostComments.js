import React from 'react'
import Comment from './Comment'
import PropTypes from 'prop-types'

const PostComments = ({comments, postId}) => {
    return (
        <div className={'commentSection'}>
            <h1>COMMENTS</h1>
            {comments.map((comment, index)=>
                <Comment key={`comments${postId}${index}`} comment={comment}/>    
            )}
            
        </div>
    )
}
PostComments.defaultProps = {
    comments: []
}

PostComments.propTypes = {
    comments: PropTypes.array
}

export default PostComments



