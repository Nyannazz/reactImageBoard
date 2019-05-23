import React from 'react'

export default function WelcomeBanner(props) {
  return (
    <div className={"userBanner"}>
      <section className='personalSection'>
        <h1>WELCOME USER</h1>
        <p>HOW ABOUT UPLOADING SOME CONTENT?!</p>
        {props.children}
      </section>
      <section className='badgeSection'>
        <h1>SECTION 2</h1>
      </section>
    </div>
  )
}
