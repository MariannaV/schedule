import React from 'react';
import { QuestionCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip } from 'antd';
import { GithubUserLink } from 'components';
import moment from 'moment-timezone';
import { ScheduleStore } from './store';

enum EventTypeColor {
  deadline = 'red',
  test = '#63ab91',
  jstask = 'green',
  htmltask = 'green',
  htmlcssacademy = 'green',
  externaltask = 'green',
  codewars = 'green',
  codejam = 'green',
  newtask = 'green',
  lecture = 'blue',
  lecture_online = 'blue',
  lecture_offline = 'blue',
  lecture_mixed = 'blue',
  lecture_self_study = 'blue',
  info = '#ff7b00',
  warmup = '#63ab91',
  meetup = '#bde04a',
  workshop = '#bde04a',
  interview = '#63ab91',
}

const EventTypeToName: Record<string, string> = {
  lecture_online: 'online lecture',
  lecture_offline: 'offline lecture',
  lecture_mixed: 'mixed lecture',
  lecture_self_study: 'self study',
  warmup: 'warm-up',
  jstask: 'js task',
  kotlintask: 'kotlin task',
  objctask: 'objc task',
  htmltask: 'html task',
  codejam: 'code jam',
  externaltask: 'external task',
  htmlcssacademy: 'html/css academy',
  codewars: 'codewars',
  // TODO: Left hardcoded (codewars:stage1|codewars:stage2) configs only for backward compatibility. Delete them in the future.
  'codewars:stage1': 'codewars',
  'codewars:stage2': 'codewars',
};

export function ScheduleTable() {
  const { timeZone } = ScheduleStore.useSelector(ScheduleStore.selectors.getUser);

  const eventsData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvents),
    tableData = React.useMemo(() => eventsData.list.map((eventId) => eventsData.map[eventId]), [eventsData]);

  const startOfToday = moment().startOf('day');

  return (
    <Table
      rowKey={(record) => record.id.toString()}
      pagination={false}
      size="small"
      dataSource={tableData}
      rowClassName={(record) => (moment(record.dateTime).isBefore(startOfToday) ? 'rs-table-row-disabled' : '')}
      columns={[
        { title: 'Date', width: 120, dataIndex: 'dateTime', render: dateRenderer(timeZone) },
        { title: 'Time', width: 60, dataIndex: 'dateTime', render: timeRenderer(timeZone) },
        {
          title: 'Type',
          width: 100,
          dataIndex: 'type',
          render: (value: keyof typeof EventTypeColor) => (
            <Tag color={EventTypeColor[value]}>{EventTypeToName[value] || value}</Tag>
          ),
        },
        {
          title: 'Place',
          dataIndex: 'place',
          render: (value: string) => {
            return value === 'Youtube Live' ? (
              <div>
                <YoutubeOutlined /> {value}{' '}
                <Tooltip title="Ссылка будет в Discord">
                  <QuestionCircleOutlined />
                </Tooltip>
              </div>
            ) : (
              value
            );
          },
        },
        {
          title: 'Name',
          dataIndex: 'name',
          render: (value: string, record) => {
            return record.descriptionUrl ? (
              <a target="_blank" href={record.descriptionUrl}>
                {value}
              </a>
            ) : (
              value
            );
          },
        },
        {
          title: 'Broadcast Url',
          width: 140,
          dataIndex: 'broadcastUrl',
          render: (url: string) =>
            url ? (
              <a target="_blank" href={url}>
                Link
              </a>
            ) : (
              ''
            ),
        },
        {
          title: 'Organizer',
          width: 140,
          dataIndex: ['organizer', 'githubId'],
          render: (value: string) => (value ? <GithubUserLink value={value} /> : ''),
        },
        {
          title: 'Details Url',
          dataIndex: 'detailsUrl',
          render: (url: string) =>
            url ? (
              <a target="_blank" href={url}>
                Details
              </a>
            ) : (
              ''
            ),
        },
        { title: 'Comment', dataIndex: 'comment' },
      ]}
    />
  );
}

export const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('YYYY-MM-DD') : '';

const timeRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('HH:mm') : '';
