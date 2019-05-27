import React, {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'

export default function FileInputField({onFileSelect}) {
  const onDrop = useCallback(acceptedFiles => {
    onFileSelect(acceptedFiles)
  }, [])
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div className={'dragAndDrop centerAll'} {...getRootProps()}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}