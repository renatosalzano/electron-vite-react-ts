import { Accordion } from '@components/accordion/Accordion';
import { Input } from '@components/input/Input';
import { Tabs } from '@components/tabs/Tabs';
import { useState, type FC } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Config } from './Config';
import { useUserdata, useGlobal } from '../../store';

type Props = {}

export const TabsConfig: FC<Props> = () => {


  const { webviews } = useUserdata()
  const { testWebviews } = useGlobal()

  const testWebviewsList = Object.values(testWebviews)

  console.log('update', testWebviewsList)


  return (
    <div className='section-tabs-config'>
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary>
            <FaPlus />
            New Tab
          </Accordion.Summary>
          <Accordion.Content >
            <Config />
          </Accordion.Content>
        </Accordion.Item>

        {Object.values(webviews).map((props) => (
          <Accordion.Item
            key={props.id}
          >
            <Accordion.Summary>
              <img className='icon' src={props.icon} />
              {props.label}
            </Accordion.Summary>
            <Accordion.Content >
              todo
            </Accordion.Content>
          </Accordion.Item>
        ))}

        {testWebviewsList.map((props) => (
          <Accordion.Item
            key={props.id}
          >
            <Accordion.Summary>
              <img className='icon' src={props.icon} />
              {props.label}
            </Accordion.Summary>
            <Accordion.Content >
              todo
            </Accordion.Content>
          </Accordion.Item>
        ))}

      </Accordion>
      {/* <Accordion>
        <Accordion.Summary />
        <Accordion.Content />
      </Accordion> */}
    </div>
  )
}
