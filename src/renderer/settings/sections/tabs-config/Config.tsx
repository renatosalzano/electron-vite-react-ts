import { Input } from '@components/input/Input';
import { useState, type FC } from 'react';

type Props = {}

export const Window: FC<Props> = () => {

  const [config, setConfig] = useState({
    label: '',
    url: ''
  })

  const onChange = (id: string, value: string) => { }

  return (
    <div>
      <Input
        id='label'
        label='Label'
        value={config.label}
        onChange={onChange}
      />

      <Input
        label="url"
        id='url'
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
    </div>
  )
}
