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

export function ScheduleTable(props: { timeZone: string }) {
  const { timeZone } = props;
  const eventService = new EventService();
  const [loading, withLoading] = useLoading(false);
  const [data, setData] = useState<Event[]>([]);
  const startOfToday = moment().startOf('day');

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
        rowClassName={(record) => (moment(record.dateTime).isBefore(startOfToday) ? 'rs-table-row-disabled' : '')}
        columns={[
          { title: 'Start Date', width: 180, dataIndex: 'dateTime', render: dateRenderer(timeZone) },
          {
            title: 'Name',
            dataIndex: 'name',
          },
          {
            title: 'DeadLine',
            width: 180,
            dataIndex: 'deadLine',
            render: dateRenderer(timeZone),
          },
          {
            title: 'Type',
            width: 100,
            dataIndex: 'type',
            render: (value: keyof typeof EventTypeColor) => (
              <Tag color={EventTypeColor[value]}>{EventTypeToName[value] || value}</Tag>
            ),
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
            dataIndex: ['organizer', 'githubId'],
            render: (value: string) => (value ? <GithubUserLink value={value} /> : ''),
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
