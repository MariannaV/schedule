import React from 'react';
import moment from 'moment-timezone';
import { dateRenderer } from '../../ScheduleTable';
import { FormItem, IFormItem } from 'components/Forms/FormItem';
import { FieldOrganizers } from 'components/Forms/fields/FieldOrganizers';
import { DatePicker, Input, Select, Tooltip } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { Event, eventTypes } from 'services/event';

import styles from './EditableCell.module.scss';

export const EditableCell = ({ editing, dataIndex, record, cancel, children, ...restProps }) => {
  let cell = '';
  if (editing) console.log(record);
  switch (dataIndex) {
    case 'dateStart':
      cell = (
        <FormItem
          name="date start"
          rules={[
            {
              required: true,
              message: 'Please select event time!',
            },
          ]}
          type="time"
        >
          <DatePicker showTime defaultValue={moment(record.dateStart)} format="DD.MM.YYYY HH:mm" />
        </FormItem>
      );
      break;
    case 'dateEnd':
      cell = (
        <FormItem
          name="date end"
          rules={[
            {
              required: true,
              message: 'Please select event deadline time!',
            },
          ]}
          type="time"
        >
          {!record.dateEnd || record.dateEnd === '' ? (
            <DatePicker showTime />
          ) : (
            <DatePicker showTime defaultValue={moment(record.dateEnd)} format="DD.MM.YYYY HH:mm" />
          )}
        </FormItem>
      );
      break;
    case 'name':
      cell = (
        <FormItem name={dataIndex} type="input">
          <Input />
        </FormItem>
      );
      break;
    case 'type':
      cell = (
        <FormItem name={dataIndex} type="select">
          <Select
            children={Object.entries({ ...eventTypes }).map(([key, value]) => (
              <Select.Option value={value} children={value} key={key} />
            ))}
          />
        </FormItem>
      );
      break;
    case 'checker':
      cell = (
        <div className={styles.action}>
          <FormItem name={dataIndex} type="select" style={{ width: '150px' }}>
            <Select
              children={Object.entries({ ...checkers }).map(([key, value]) => (
                <Select.Option value={value} children={value} key={key} />
              ))}
            />
          </FormItem>
          <Tooltip title="Cancel">
            <CloseOutlined className={styles.icon} onClick={cancel} />
          </Tooltip>
          <Tooltip title="Save">
            <SaveOutlined className={styles.icon} />
          </Tooltip>
        </div>
      );
      break;
    case 'place':
      cell = (
        <FormItem name={dataIndex} type="input">
          <Input />
        </FormItem>
      );
      break;
    case 'organizers':
      cell = (
        <FormItem name={dataIndex} type="select">
          <FieldOrganizers mode="multiple" />
        </FormItem>
      );
      break;
    case 'descriptionUrl':
      cell = (
        <FormItem name={dataIndex} type="input">
          <Input />
        </FormItem>
      );
      break;
    case 'description':
      cell = (
        <FormItem name={dataIndex} type="input">
          <Input />
        </FormItem>
      );
      break;
    default:
      cell = '';
      break;
  }

  return <td {...restProps}>{editing ? cell : children}</td>;
};

enum checkers {
  crossCheck = 'crosscheck',
  autoTest = 'auto-test',
  mentor = 'mentor',
  none = 'none',
}
