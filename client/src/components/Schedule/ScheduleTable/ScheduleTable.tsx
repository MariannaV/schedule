import React from 'react';
import moment from 'moment-timezone';
import {
  QuestionCircleOutlined,
  YoutubeOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleTwoTone,
} from '@ant-design/icons';
import { Table, Tag, Tooltip, Button } from 'antd';
import { useRouter } from 'next/router';
import { Event } from 'services/event';
import { GithubUserLink } from 'components';
import { ScheduleStore } from 'components/Schedule/store';
import { Filter } from './components/Filter/Filter';
import { rowsFilter, defaultColumnsFilter } from './config';
import { tagColors } from '../constants';
import styles from './style.module.scss';

const startOfToday = moment().startOf('day');

function isRowDisabled(dateTime, deadLine) {
  return deadLine
    ? moment(dateTime).isBefore(startOfToday) && moment(deadLine).isBefore(startOfToday)
    : moment(dateTime).isBefore(startOfToday);
}

export function ScheduleTable() {
  const timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    isActiveDates = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsActiveDates),
    eventsData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvents),
    tableData = React.useMemo(() => eventsData.list.map((eventId) => eventsData.map[eventId]), [eventsData]);

  const [checkedColumns, setCheckedColumns] = React.useState(defaultColumnsFilter);
  const [selectedRows, setSelectedRows] = React.useState([] as string[]);
  const [hiddenRows, setHiddenRows] = React.useState([] as string[]);

  const hideRows = () => {
    setHiddenRows([...selectedRows, ...hiddenRows]);
    setSelectedRows([]);
  };

  return (
    <>
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
          className={styles.table}
          rowKey={(record) => record.id.toString()}
          onRow={(record) => {
            return {
              onClick: (e) => {
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
          pagination={{ position: ['bottomRight'], showSizeChanger: true }}
          dataSource={
            isActiveDates
              ? tableData.filter(
                  (data) => !isRowDisabled(data.dateStart, data.dateEnd) && !hiddenRows.includes(data.id),
                )
              : tableData.filter((data) => !hiddenRows.includes(data.id))
          }
          rowClassName={(record) => {
            if (selectedRows.includes(record.id)) {
              return styles.activeRow;
            }
            if (isRowDisabled(record.dateStart, record.dateEnd)) {
              return 'rs-table-row-disabled';
            }
            return styles[record.type.toLowerCase().split(' ').join('')];
          }}
          scroll={{ x: 1600 }}
          // @ts-ignore
          columns={[
            {
              title: 'Start Date',
              width: 80,
              align: 'center',
              dataIndex: 'dateStart',

              render: dateRenderer(timeZone),
              defaultSortOrder: 'ascend',
              sorter: (a, b) => (a.dateStart > b.dateStart ? 1 : -1),
              sortDirections: ['ascend', 'descend', 'ascend'],
            },
            {
              title: 'Name',
              width: 185,
              dataIndex: 'name',
              sorter: (a, b) => (a.name > b.name ? 1 : -1),
              sortDirections: ['ascend', 'descend', 'ascend'],
            },
            {
              title: 'DeadLine',
              width: 120,
              align: 'center',
              dataIndex: 'dateEnd',
              render: (value: string) => {
                if (!value) return;
                if (moment(value).isBefore(startOfToday)) {
                  return dateRenderer(timeZone)(value);
                }
                let deadline;
                if (moment(value).subtract(7, 'days').isBefore(startOfToday)) {
                  deadline = 'deadline_coming';
                }
                if (moment(value).subtract(3, 'days').isBefore(startOfToday)) {
                  deadline = 'deadline_close';
                }
                const warning = moment(value).subtract(1, 'days').isBefore(moment());
                return (
                  <div className={styles[deadline]}>
                    <span>{dateRenderer(timeZone)(value)}</span>
                    {warning && (
                      <Tooltip title="Only one day left!">
                        <ExclamationCircleTwoTone twoToneColor="#f5222d" style={{ fontSize: 22, marginLeft: 5 }} />
                      </Tooltip>
                    )}
                  </div>
                );
              },
              sorter: (a, b) => (a.dateEnd > b.dateEnd ? 1 : -1),
              sortDirections: ['ascend', 'descend', 'ascend'],
            },
            {
              title: 'Type',
              width: 120,
              align: 'center',
              dataIndex: 'type' || '',
              render: (value: keyof typeof tagColors) => (
                <Tag color={tagColors[value.toLowerCase()]} className={styles.tag}>
                  {value}
                </Tag>
              ),
              sorter: (a, b) => (a.type > b.type ? 1 : -1),
              sortDirections: ['ascend', 'descend', 'ascend'],
              filters: rowsFilter,
              onFilter: (value: string | number | boolean, record: Event) =>
                record.type.toLowerCase().indexOf(value.toString().toLowerCase()) === 0,
            },
            {
              title: 'Action',
              width: 300,
              dataIndex: 'checker',
              render: (value: string, eventData: Event) => actionButtonsRenderer(value ?? '', eventData),
            },
            {
              title: 'Place',
              width: 130,
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
              title: 'Organizer',
              width: 120,
              dataIndex: 'organizer',
              render: (value: string) => (value ? <GithubUserLink value={value} /> : ''),
              sorter: (a, b) => (a.organizer > b.organizer ? 1 : -1),
              sortDirections: ['ascend', 'descend', 'ascend'],
            },
            {
              title: 'Description URL',
              width: 200,
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
              title: 'Description',
              width: 250,
              dataIndex: 'description',
              className: `${styles.cutted}`,
            },
          ].filter((column) => checkedColumns.includes(column.title))}
        />
      )}
    </>
  );
}

export const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('DD.MM.YYYY HH:mm') : '';

const actionButtonsRenderer = (checker, eventData: Event) => {
  const router = useRouter();
  const ButtonDetails = React.useMemo(
    () => (
      <Button
        type={'primary'}
        className={styles.btn}
        children="Details"
        href={`/course/schedule/event/${eventData.id}`}
        target="_blank"
      />
    ),
    [eventData.id],
  );

  switch (checker) {
    case 'crossCheck':
      return (
        <>
          {ButtonDetails}
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
          {ButtonDetails}
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
          {ButtonDetails}
          <EyeInvisibleOutlined className={styles.iconHide} />
        </>
      );
  }
};
