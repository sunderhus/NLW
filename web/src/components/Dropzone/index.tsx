import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FiUpload } from 'react-icons/fi'
import { Container } from './styles'

interface DropzoneProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<DropzoneProps> = ({ onFileUploaded, ...rest }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');


  const onDrop = useCallback(acceptedFiles => {
    const [file] = acceptedFiles;

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);

    onFileUploaded(file);
  }, [onFileUploaded])

  const { getRootProps, getInputProps } = useDropzone({ onDrop })

  return (
    <Container {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {selectedFileUrl
        ? <img src={selectedFileUrl} alt="Point Image" />
        : (
          <p><FiUpload />Imagem do estabelecimento</p>

        )
      }
    </Container>
  )
}

export default Dropzone;
