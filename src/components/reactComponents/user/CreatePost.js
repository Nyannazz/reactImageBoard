import React, { Component } from 'react'
import axios from 'axios'
import FileInputField from './userPage/FileInputField.js'
//const BASEURL="http://192.168.178.21/image-board/public/posts"
const BASEURL='http://image-board.local/posts';



export default class CreatePost extends Component {
    constructor(props) {
      super(props)
      this.changeFile=this.changeFile.bind(this)
      this.sendFiles=this.sendFiles.bind(this)
      this.state = {
         upload: "",
         file: "",
         title: "",
         body: "",
         tags: "",
         postCreated: ""
      }
    }
  
/*   changeFile(event){
    const val=event.target.files[0];
    let blob=new Blob([val])
    let objectURL=URL.createObjectURL(blob);
    this.setState({upload:objectURL,file:val})
    console.dir(val)
    
  } */
  changeFile(file){
    const val=file[0];
    let blob=new Blob([val])
    let objectURL=URL.createObjectURL(blob);
    this.setState({upload:objectURL,file:val,postCreated: ''})
    console.dir(val)
    
  }

  sendFiles(event){
    event.preventDefault()
    const tagArrString=JSON.stringify(this.state.tags.split(";"));
    let formData=new FormData()
    formData.append('file',this.state.file)
    formData.append('title',this.state.title)
    formData.append('createdBy','1')
    formData.append('body',this.state.body)
    formData.append('tags',tagArrString)
    axios.post(`${BASEURL}`,
            formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                }
            }
        ).then(response=> {
            this.setState({postCreated:"POST SUCCESFULLY CREATED"})
        })
        .catch(function (error) {
            console.log(error);
            window.alert('failure')
        });
  }
  onChange=(event)=>{
    const name=event.target.name;
    const value=event.target.value;

    this.setState({[name]:value})
  }
    
  render() {
    return (
      <div className={'uploadComp'}>
      <form onSubmit={this.sendFiles} className='uploadForm'>
        <FileInputField onFileSelect={this.changeFile}/>
        {(this.state.upload&&!this.state.postCreated)&&[
        <input name='title' value={this.state.title} onChange={this.onChange} placeholder='give your upload a name' key={0} type='text'></input>,
        <input name='tags' value={this.state.tags} onChange={this.onChange} placeholder='add some tags seperate by ";"' key={1} type='text'></input>,
        <textarea name='body' value={this.state.body} onChange={this.onChange} placeholder='add a comment if you want' key={2} ></textarea>,
        <input className='submitButtonMain' key={3} type='submit'></input>]}
        {this.state.postCreated&&<div className={'postSucces centerAll'}>{this.state.postCreated}</div>}
      </form>
      <div className={'imageContainer centerAll'}>
        <img alt='' src={this.state.upload}></img>
      </div>
      </div>
    )
  }
}
