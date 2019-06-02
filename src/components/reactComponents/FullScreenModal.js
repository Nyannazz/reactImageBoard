import React from 'react'

export default function FullScreenModal(props) {
    return (
        <div onClick={props.close} className={'fullScreenModal centerAll'}>
            {props.children}
        </div>
    )
}
