import { QuestionCircleOutlined, YoutubeOutlined, EyeOutlined, EyeInvisibleOutlined } from '@ant-design/icons';
import { Table, Tag, Tooltip, Spin, Button } from 'antd';
import { useRouter } from 'next/router';
import { GithubUserLink } from 'components';
import React from 'react';
import { useState } from 'react';
import moment from 'moment-timezone';
import { API_Events, Event } from '../../../services/event';
import { rowsFilter, defaultColumnsFilter } from './config';
import { Filter } from './components/Filter/Filter';
import { ScheduleStore } from '../store';

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
  video: 'purple',
};

function isRowDisabled(dateTime, deadLine) {
  const startOfToday = moment().startOf('day');
  return deadLine
    ? moment(dateTime).isBefore(startOfToday) && moment(deadLine).isBefore(startOfToday)
    : moment(dateTime).isBefore(startOfToday);
}

export function ScheduleTable() {
  const { store } = React.useContext(ScheduleStore.context),
    { timeZone, isActiveDates } = store.user;

  const { eventsLoading, eventsData } = API_Events.hooks.useEventsData(),
    tableData = React.useMemo(() => eventsData.list.map((eventId) => eventsData.map[eventId]), [eventsData]);
  console.log(tableData);

  const [checkedColumns, setCheckedColumns] = useState(defaultColumnsFilter);
  const [selectedRows, setSelectedRows] = useState([] as string[]);
  const [hiddenRows, setHiddenRows] = useState([] as string[]);

  const hideRows = () => {
    console.log('hide');
    setHiddenRows([...selectedRows, ...hiddenRows]);
    console.log(selectedRows, hiddenRows);
    setSelectedRows([]);
  };

  return (
    <Spin spinning={!!eventsLoading}>
      <div className={styles.settings}>
        <Filter
          checkedColumns={checkedColumns}
          setCheckedColumns={setCheckedColumns}
          filterOptions={defaultColumnsFilter}
        />
        {hiddenRows.length > 0 && (
          <span onClick={() => setHiddenRows([])}>
            <EyeOutlined className={styles.iconShow} />
            <span>Show hidden rows</span>
          </span>
        )}
      </div>
      {checkedColumns.length && (
        <Table
          rowKey={(record) => record.id.toString()}
          onRow={(record) => {
            return {
              onClick: (e) => {
                console.log(record);
                if ((e.target as HTMLElement).closest('[data-icon="eye-invisible"]')) {
                  hideRows();
                  return;
                }
                if (e.shiftKey) {
                  selectedRows.includes(record.id)
                    ? setSelectedRows(selectedRows.filter((item) => item !== record.id))
                    : setSelectedRows([...selectedRows, record.id]);
                } else {
                  setSelectedRows([record.id]);
                }
              },
            };
          }}
          pagination={false}
          size="small"
          dataSource={
            isActiveDates
              ? tableData.filter(
                  (data) => !isRowDisabled(data.dateTime, data.deadLine) && !hiddenRows.includes(data.id),
                )
              : tableData.filter((data) => !hiddenRows.includes(data.id))
          }
          rowClassName={(record) => {
            if (selectedRows.includes(record.id)) {
              return styles.activeRow;
            }
            if (isRowDisabled(record.dateTime, record.deadLine)) {
              return 'rs-table-row-disabled';
            }
            return styles[record.type.split(' ').join('')];
          }}
          // @ts-ignore
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
              filters: rowsFilter,
              onFilter: (value: string | number | boolean, record: Event) =>
                record.type.indexOf(value.toString()) === 0,
            },
            {
              title: 'Action',
              width: 325,
              dataIndex: 'checker',
              render: (value: string) => (value ? actionButtonsRenderer(value) : actionButtonsRenderer('')),
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
              title: 'Description URL',
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
              title: 'Broadcast URL',
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
          ].filter((column) => checkedColumns.includes(column.title))}
        />
      )}
    </Spin>
  );
}

export const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('DD.MM.YYYY HH:mm') : '';

const actionButtonsRenderer = (checker) => {
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
          <EyeInvisibleOutlined className={styles.iconHide} />
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
          <EyeInvisibleOutlined className={styles.iconHide} />
        </>
      );
    default:
      return (
        <>
          <Button type={'primary'} className={styles.btn}>
            Details
          </Button>
          <EyeInvisibleOutlined className={styles.iconHide} />
        </>
      );
  }
};
