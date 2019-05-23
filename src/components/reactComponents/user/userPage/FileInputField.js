import React from 'react'

export default function FileInputField() {
  return (
    <div>
      <input onChange={this.props.changeFile} name='uploadInput' id='uploadInput' type='file'></input>
{/*         <input onChange={this.changeFile} name='uploadInput' id='uploadInput' type='file'></input>
 */}
        {/* <label id='uploadInputLabel' htmlFor='uploadInput'>
          drag and drop
        </label> */}
    </div>
  )
}
