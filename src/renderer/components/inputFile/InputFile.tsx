import './inputfile.css'
import { DragEventHandler, FC, useState } from "react";
import { CommonProps } from "../types";
import { VscFileMedia, VscTrash } from "react-icons/vsc";
import { Button } from 'src/renderer/components/button/Button'


type InputFileProps = CommonProps & {
}


export const InputFile: FC<InputFileProps> = ({
  id,
  value = '',
  label,
  onChange
}) => {

  const [isDragging, setDragging] = useState(false);
  const [base64, setBase64] = useState(value)


  const onFilesDropped = (files: File[]) => {
    const file = files[0]

    const acceptedTypes = ['image/png', 'image/svg+xml', 'image/webp', 'image/x-icon']

    if (!acceptedTypes.includes(file.type)) {
      console.log(`File not supported: ${file.type}. Must be PNG, SVG or WebP`);
      return;
    }

    const reader = new FileReader();

    reader.onload = (event: ProgressEvent<FileReader>) => {

      if (event !== null) {

        const file_string: string = event.target?.result as string
        // console.log(file_string)
        setBase64(file_string)
        onChange(id, file_string)

      }
    }

    reader.readAsDataURL(file)

  }


  const remove = () => {
    setBase64('')
    onChange(id, '')
  }


  const handleDragOver: DragEventHandler<HTMLDivElement> = (e) => {
    // console.log('drag over')
    e.preventDefault();
  };

  const handleDragEnter: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(true);
    // console.log('drag enter')
  };

  const handleDragLeave: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop: DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    setDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      onFilesDropped(droppedFiles);
    }
  };

  return (
    <div
      className={cls("input-file", {
        active: isDragging
      })}
    >

      <div className="label-area">
        <label htmlFor={id}>
          {label ?? id}
        </label>

        {base64 && !isDragging && (
          <Button
            variant='icon'
            size='small'
            color='danger'
            onClick={remove}
          >
            <VscTrash />
          </Button>)
        }
      </div>

      <div
        className={cls("drop-area", {
          'is-dragging': isDragging
        })}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          id={id}
          type='file'
          accept="image/*"
          onChange={(evt) => evt.target.files && onFilesDropped(Array.from(evt.target.files))}
        />
        <div className="suggestion">
          {base64
            ? <img src={base64} />
            : <VscFileMedia />
          }
          <p>
            {isDragging
              ? 'Release.'
              : 'Choose a file or drag it here.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}