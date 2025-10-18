import { Accordion } from '@components/accordion/Accordion';
import { Input } from '@components/input/Input';
import { Tabs } from '@components/tabs/Tabs';
import { useState, type FC } from 'react';
import { FaPlus } from 'react-icons/fa';

type Props = {}

export const TabsConfig: FC<Props> = () => {


  return (
    <div>
      <Accordion>
        <Accordion.Item>
          <Accordion.Summary>
            <FaPlus />
            New Tab
          </Accordion.Summary>
          <Accordion.Content >
            todo
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
      {/* <Accordion>
        <Accordion.Summary />
        <Accordion.Content />
      </Accordion> */}
    </div>
  )
}
