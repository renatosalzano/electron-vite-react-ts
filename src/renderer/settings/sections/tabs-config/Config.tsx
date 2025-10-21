import './config.css'
import { Button, Input, InputFile } from '@components/index';
import { WebviewConfig } from '@store/userdata';
import { useState, type FC } from 'react';
import { VscSave, VscTrash } from 'react-icons/vsc';
import { useUserdata, useGlobal } from '../../store';

type Props = {
  webviewID?: string
}


const DEFAULT_CONFIG = {
  id: '',
  label: '',
  url: '',
  icon: '',
}


export const Config: FC<Props> = ({
  webviewID
}) => {

  const { setWebview } = useUserdata()
  // const { setTestWebview } = useGlobal()

  const [config, setConfig] = useState<WebviewConfig>(() => {

    if (webviewID) {
      const { webviews } = useUserdata.getState()

      if (webviews[webviewID]) {
        return {
          ...webviews[webviewID]
        }
      }
    }

    return {
      ...DEFAULT_CONFIG
    }
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

  const save = () => {
    setWebview(config.id, config)
    // setTestWebview(config.id, config)

    if (!webviewID) {
      setConfig((prev) => ({
        ...prev,
        id: '',
        label: '',
        url: '',
        icon: '',
      }))
    }
  }

  const remove = () => {

    setWebview(config.id, null)

  }

  const disabled = Object.values(config).some((value) => value === '')

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
        value={config.icon}
        onChange={onChange}
      />

      <div className="button-container">
        <Button
          variant='contained'
          size='normal'
          disabled={disabled}
          onClick={save}
        >
          <VscSave /> Save
        </Button>

        {webviewID && <Button
          variant='contained'
          size='normal'
          disabled={disabled}
          onClick={remove}
        >
          <VscTrash /> Delete
        </Button>
        }
      </div>
    </div>
  )
}
