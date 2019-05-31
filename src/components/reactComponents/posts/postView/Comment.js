import React from 'react'

const Comment = ({comment}) => {
    //nested comments disabled for now
    return (
        <div className={'commentCell'}>
            <div className='commentRow'>{comment}
                this offends me and my day is ruined
                this offends me and my day is ruined
                this offends me and my day is ruined
                this offends me and my day is ruined
                this offends me and my day is ruined
                this offends me and my day is ruined
                this offends me and my day is ruined
            </div>
            {/* <div className={'answerCell'}>
                <div className='commentRow'>MY COMMENT IS NOT GOOD</div>
                {props.children}
            </div> */}
        </div>
    )
}

export default Comment
