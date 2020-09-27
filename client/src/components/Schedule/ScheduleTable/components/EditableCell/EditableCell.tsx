import React from 'react';
import moment from 'moment-timezone';
import { FormItem } from 'components/Forms/FormItem';
import { FieldOrganizers } from 'components/Forms/fields/FieldOrganizers';
import { DatePicker, Input, Select, Tooltip } from 'antd';
import { CloseOutlined, SaveOutlined } from '@ant-design/icons';
import { eventTypes } from 'services/event';

import styles from './EditableCell.module.scss';

export const EditableCell = ({ editing, dataIndex, record, save, cancel, children, ...restProps }) => {
  let cell: JSX.Element;
  switch (dataIndex) {
    case 'dateStart':
      cell = (
        <FormItem
          name={dataIndex}
          rules={[
            {
              required: true,
              message: 'Please select event time!',
            },
          ]}
          getValueProps={(value) => moment(value)}
          type="time"
        >
          <DatePicker showTime defaultValue={moment(record.dateStart)} format="DD.MM.YYYY HH:mm" />
        </FormItem>
      );
      break;
    case 'dateEnd':
      cell = (
        <FormItem name={dataIndex} getValueProps={(value) => moment(value)} type="time">
          <DatePicker
            showTime
            defaultValue={record.dateEnd !== '' && record.dateEnd !== null ? moment(record.dateEnd) : undefined}
            format="DD.MM.YYYY HH:mm"
          />
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
            <SaveOutlined className={styles.icon} onClick={save} />
          </Tooltip>
        </div>
      );
      break;
    case 'organizers':
      cell = (
        <FormItem name={dataIndex} type="select">
          <FieldOrganizers mode="multiple" />
        </FormItem>
      );
      break;
    default:
      cell = (
        <FormItem name={dataIndex} type="input">
          <Input />
        </FormItem>
      );
      break;
  }

  return <td {...restProps}>{editing ? cell : children}</td>;
};

enum checkers {
  crosscheck = 'crosscheck',
  autoTest = 'auto-test',
  mentor = 'mentor',
  none = 'none',
}
