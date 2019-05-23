import React, { Component } from 'react'
import axios from 'axios'
import FileInputField from './userPage/FileInputField.js'



export default class CreatePost extends Component {
    constructor(props) {
      super(props)
      this.changeFile=this.changeFile.bind(this)
      this.sendFiles=this.sendFiles.bind(this)
      this.state = {
         upload: "",
         file: ""
      }
    }
  
  changeFile(event){
    const val=event.target.files[0];
    let blob=new Blob([val])
    let objectURL=URL.createObjectURL(blob);
    this.setState({upload:objectURL,file:val})
    console.dir(val)
    
  }
  sendFiles(event){
    event.preventDefault()

    let formData=new FormData()
    formData.append('file',this.state.file)
    formData.append('title','hello')
    formData.append('createdBy','1')
    formData.append('body','some body')
    formData.append('tags','sponge; bob; patrick')
    axios.post('http://image-board.local/posts',
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                }
            }
        ).then(function (response) {
            console.dir(response.data);
        })
        .catch(function (error) {
            console.log(error);
            window.alert('failure')
        });
  }
    
  render() {
    return (
      <div className={'uploadComp'}>
      <form onSubmit={this.sendFiles} className='uploadForm'>
        {/* <FileInputField onChange={this.changeFile}></FileInputField> */}
        <input onChange={this.changeFile} name='uploadInput' id='uploadInput' type='file'></input>
        {this.state.upload&&[
        <input placeholder='give your upload a name' key={0} type='text'></input>,
        <input placeholder='add some tags seperate by ";"' key={1} type='text'></input>,
        <textarea placeholder='add a comment if you want' key={2} ></textarea>,
        <input key={3} type='submit'></input>]}
      </form>
      <div className={'imageContainer centerAll'}>
        <img src={this.state.upload}></img>
      </div>
      </div>
    )
  }
}
