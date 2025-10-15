

import { InputFile } from 'components/inputFile/inputfile';
import './config.css'
import { useState, type FC } from 'react';

type Props = {}

export const Config: FC<Props> = () => {

  const [data, setData] = useState<WebViewConfig>({
    icon: '',
    url: '',
    label: '',
    id: ''
  })

  const onChange = (id: string, value: string) => { }

  return (
    <div className="config">
      config test
      <InputFile
        id='icon'
        label='Icon'
        onChange={onChange}
      />
    </div>
  )
}
