import React from 'react'
import PropTypes from 'prop-types'


const Comment = ({comment}) => {
    //nested comments disabled for now
    return (
        <div className={'commentCell'}>
            <div className='commentRow'>
                {comment.body}
            </div>
            {/* <div className={'answerCell'}>
                <div className='commentRow'>MY COMMENT IS NOT GOOD</div>
                {props.children}
            </div> */}
        </div>
    )
}

Comment.propTypes = {
    comment: PropTypes.object
}

export default Comment
