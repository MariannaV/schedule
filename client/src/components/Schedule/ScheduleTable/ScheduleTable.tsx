import { QuestionCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip, Spin, Button } from 'antd';
import { useRouter } from 'next/router';
import { GithubUserLink } from 'components';
import { useState } from 'react';
import { Event, EventService } from '../../../services/event';
import moment from 'moment-timezone';
import { useAsync } from 'react-use';
import { useLoading } from 'components/useLoading';

import styles from './style.module.scss';

const tagColors = {
  codejam: 'green',
  codewars: 'green',
  course: 'green',
  interview: 'volcano',
  lecture: 'purple',
  'self-education': 'gold',
  task: 'green',
  test: 'cyan',
};

function isRowDisabled(dateTime, deadLine) {
  const startOfToday = moment().startOf('day');
  return deadLine
    ? moment(dateTime).isBefore(startOfToday) && moment(deadLine).isBefore(startOfToday)
    : moment(dateTime).isBefore(startOfToday);
}

export function ScheduleTable(props: { timeZone: string }) {
  const { timeZone } = props;
  const eventService = new EventService();
  const [loading, withLoading] = useLoading(false);
  const [data, setData] = useState<Event[]>([]);

  useAsync(
    withLoading(async () => {
      const data = await eventService.getEvents();
      setData(data);
    }),
    [EventService],
  );

  return (
    <Spin spinning={loading}>
      <Table
        rowKey={(record) => record.id.toString()}
        pagination={false}
        size="small"
        dataSource={data}
        rowClassName={(record) =>
          isRowDisabled(record.dateTime, record.deadLine)
            ? 'rs-table-row-disabled'
            : styles[record.type.split(' ').join('')]
        }
        columns={[
          {
            title: 'Start Date',
            width: 180,
            dataIndex: 'dateTime',
            render: dateRenderer(timeZone),
            defaultSortOrder: 'ascend',
            sorter: (a, b) => (a.dateTime > b.dateTime ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
          },
          {
            title: 'Name',
            dataIndex: 'name',
            sorter: (a, b) => (a.name > b.name ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
          },
          {
            title: 'DeadLine',
            width: 180,
            dataIndex: 'deadLine',
            render: dateRenderer(timeZone),
            sorter: (a, b) => (a.deadLine > b.deadLine ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
          },
          {
            title: 'Type',
            width: 100,
            dataIndex: 'type' || '',
            render: (value: keyof typeof tagColors) => <Tag color={tagColors[value]}>{value}</Tag>,
            sorter: (a, b) => (a.type > b.type ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
            filters: [
              {
                text: 'code jam',
                value: 'code jam',
              },
              {
                text: 'codewars',
                value: 'codewars',
              },
              {
                text: 'course',
                value: 'course',
              },
              {
                text: 'interview',
                value: 'interview',
              },
              {
                text: 'lecture',
                value: 'lecture',
              },
              {
                text: 'self-education',
                value: 'self-education',
              },
              {
                text: 'task',
                value: 'task',
              },
              {
                text: 'test',
                value: 'test',
              },
            ],
            onFilter: (value: string | number | boolean, record: Event) => record.type.indexOf(value) === 0,
          },
          {
            title: 'Action',
            width: 310,
            dataIndex: 'checker',
            render: (value: string) => (value ? actionButtonRenderer(value) : actionButtonRenderer('')),
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
            sorter: (a, b) => (a.place > b.place ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
          },
          {
            title: 'Description Url',
            dataIndex: 'descriptionUrl',
            render: (value: string) => {
              return (
                <a target="_blank" href={value}>
                  {value}
                </a>
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
            dataIndex: 'organizer',
            render: (value: string) => (value ? <GithubUserLink value={value} /> : ''),
            sorter: (a, b) => (a.organizer > b.organizer ? 1 : -1),
            sortDirections: ['ascend', 'descend', 'ascend'],
          },
          {
            title: 'Description',
            width: 300,
            dataIndex: 'description',
          },
          { title: 'Comment', width: 300, dataIndex: 'comment' },
        ]}
      />
    </Spin>
  );
}

const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('DD.MM.YYYY HH:mm') : '';

const actionButtonRenderer = (checker: string) => {
  const router = useRouter();
  switch (checker) {
    case 'crossCheck':
      return (
        <>
          <Button type={'primary'} className={styles.btn}>
            Details
          </Button>
          <Button
            type={'primary'}
            className={`${styles.btn} ${styles.submit}`}
            onClick={() => router.push(`/course/student/cross-check-submit?course=test-course`)}
          >
            Submit
          </Button>
          <Button
            type={'primary'}
            className={`${styles.btn} ${styles.check}`}
            onClick={() => router.push(`/course/student/cross-check-review?course=test-course`)}
          >
            Crosscheck
          </Button>
        </>
      );
    case 'auto-test':
      return (
        <>
          <Button type={'primary'} className={styles.btn}>
            Details
          </Button>
          <Button
            type={'primary'}
            className={`${styles.btn} ${styles.check}`}
            onClick={() => router.push(`/course/student/auto-test?course=test-course`)}
          >
            Auto-Test
          </Button>
        </>
      );
    default:
      return (
        <Button type={'primary'} className={styles.btn}>
          Details
        </Button>
      );
  }
};
