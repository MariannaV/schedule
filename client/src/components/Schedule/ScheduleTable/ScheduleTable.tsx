import { QuestionCircleOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip, Spin, Button } from 'antd';
import { useRouter } from 'next/router';
import { GithubUserLink } from 'components';
import { useState } from 'react';
import { CourseEvent, CourseService, CourseTaskDetails } from 'services/course';
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

const TaskTypes = {
  test: 'test',
  newtask: 'newtask',
  lecture: 'lecture',
};

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

export function ScheduleTable(props: { timeZone: string; courseService: CourseService }) {
  const { timeZone, courseService } = props;
  const [loading, withLoading] = useLoading(false);
  const [data, setData] = useState<CourseEvent[]>([]);
  const startOfToday = moment().startOf('day');

  useAsync(
    withLoading(async () => {
      const [events, tasks] = await Promise.all([
        courseService.getCourseEvents(),
        courseService.getCourseTasksDetails(),
      ]);
      const data = events.concat(tasksToEvents(tasks)).sort((a, b) => a.dateTime.localeCompare(b.dateTime));
      setData(data);
    }),
    [courseService],
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
            dataIndex: ['event', 'name'],
            render: (value: string, record) => {
              return record.event.descriptionUrl ? (
                <a target="_blank" href={record.event.descriptionUrl}>
                  {value}
                </a>
              ) : (
                value
              );
            },
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
            dataIndex: ['event', 'type'],
            render: (value: keyof typeof EventTypeColor) => (
              <Tag color={EventTypeColor[value]}>{EventTypeToName[value] || value}</Tag>
            ),
          },
          {
            title: 'Action',
            width: 310,
            dataIndex: ['event', 'checker'] || '',
            render: (value: string, record) =>
              record.checker ? actionButtonRenderer(record.checker) : actionButtonRenderer(''),
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

const tasksToEvents = (tasks: CourseTaskDetails[]) => {
  return tasks.reduce((acc: Array<CourseEvent>, task: CourseTaskDetails) => {
    acc.push(createCourseEventFromTask(task, task.type));
    return acc;
  }, []);
};

const createCourseEventFromTask = (task: CourseTaskDetails, type: string): CourseEvent => {
  console.log(task);
  return {
    id: task.id,
    checker: task.checker,
    dateTime: task.studentStartDate || '',
    deadLine: task.studentEndDate || '',
    event: {
      type: type,
      name: task.name,
      descriptionUrl: task.descriptionUrl,
    },
    organizer: {
      githubId: task.taskOwner ? task.taskOwner.githubId : '',
    },
  } as CourseEvent;
};
