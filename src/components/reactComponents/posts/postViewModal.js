import React from 'react'

export default function postViewModal({children}) {
    return (
        <div id='postViewModal'>
            <div className='innerContent'>
                {children}
            </div>
        </div>
    )
}
