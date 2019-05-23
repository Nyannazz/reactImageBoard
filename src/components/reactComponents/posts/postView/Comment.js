import React from 'react'

const Comment = (props) => {
    return (
        <div className={'commentCell'}>
            <div className='commentRow'>MY COMMENT IS NOT GOOD</div>
            <div className={'answerCell'}>
                {/* <div className='commentRow'>MY COMMENT IS NOT GOOD</div> */}
                {props.children}
            </div>
        </div>
    )
}

export default Comment
