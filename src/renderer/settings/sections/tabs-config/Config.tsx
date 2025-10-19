import './config.css'
import { Button, Input, InputFile } from '@components/index';
import { WebviewConfig } from '@store/userdata';
import { useState, type FC } from 'react';
import { VscSave } from 'react-icons/vsc';

type Props = {}

export const Config: FC<Props> = () => {

  const [config, setConfig] = useState<WebviewConfig>({
    id: '',
    label: '',
    url: '',
    icon: '',
  })

  const onChange = (id: keyof WebviewConfig, value: string) => {
    if (id === 'label') {
      config.id = `${value.toLocaleLowerCase().replace(/\s/g, '')}${new Date().getTime()}`
    }

    if (id === 'url') {

      if (/^https?/g.test(value)) {
      } else {
        value = `https://${value}`
      }
    }

    config[id] = value
    setConfig(() => ({ ...config }))
  }

  return (
    <div className='config'>
      <Input
        id='label'
        label='Label'
        value={config.label}
        onChange={onChange}
      />

      <Input
        id='url'
        label='URL'
        value={config.url}
        onChange={onChange}
      >
        {/* https:// */}
        <datalist id='url-suggestions'>
          <option value="mail.google.com/"></option>
          <option value="outlook.office.com/mail/"></option>
          <option value="mail.yahoo.com/"></option>
          <option value="www.icloud.com/mail/"></option>
        </datalist>
      </Input>

      <InputFile
        label='icon'
        id='icon'
        onChange={onChange}
      />

      <div className="button-container">
        <Button
          variant='contained'
          size='normal'
        >
          <VscSave /> Save
        </Button>
      </div>
    </div>
  )
}
