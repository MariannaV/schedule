import React from 'react';
import moment from 'moment-timezone';
import {
  QuestionCircleOutlined,
  YoutubeOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  ExclamationCircleTwoTone,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { Table, Tag, Tooltip, Button, Form } from 'antd';
import { Event, EventService } from 'services/event';
import { GithubUserLink } from 'components';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import { Filter } from './components/Filter/Filter';
import { EditableCell } from './components/EditableCell/EditableCell';
import { rowsFilter, defaultColumnsFilter } from './config';
import { tagColors } from '../constants';
import { IScheduleDetailViewModal, ScheduleDetailViewModal } from '../ScheduleDetailView/ScheduleDetailViewModal';
import styles from './style.module.scss';

const startOfToday = moment().startOf('day');

function isRowDisabled(dateTime: string, deadLine: string, id?: string) {
  if (id === 'new') return false;
  return deadLine
    ? moment(dateTime).isBefore(startOfToday) && moment(deadLine).isBefore(startOfToday)
    : moment(dateTime).isBefore(startOfToday);
}

export function ScheduleTable() {
  const timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    isActiveDates = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsActiveDates),
    eventsData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvents),
    userIsMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    tableData = React.useMemo(() => eventsData.list.map((eventId) => eventsData.map[eventId]), [eventsData]),
    { dispatch } = React.useContext(ScheduleStore.context);

  const [form] = Form.useForm();
  const [checkedColumns, setCheckedColumns] = React.useState(defaultColumnsFilter);
  const [selectedRows, setSelectedRows] = React.useState([] as string[]);
  const [hiddenRows, setHiddenRows] = React.useState([] as string[]);
  const [editingKey, setEditingKey] = React.useState('');
  const [dataSource, setDataSource] = React.useState(tableData);

  React.useEffect(
    function tableDataUpdate() {
      setDataSource(tableData);
    },
    [tableData],
  );

  const [isVisibleDetailViewModal, setVisibleDetailViewModal] = React.useState<IScheduleDetailViewModal['isVisible']>(
    null,
  );

  const initialFormValues = React.useMemo(
    () => ({
      id: 'new',
      dateStart: '',
      name: '',
      dateEnd: '',
      type: '',
      checker: '',
      place: '',
      organizers: [],
      descriptionUrl: '',
      description: '',
      timeZone,
    }),
    [],
  );

  const isEditing = (record) => record.id === editingKey;

  const hideRows = () => {
    setHiddenRows([...selectedRows, ...hiddenRows]);
    setSelectedRows([]);
  };

  const edit = (record) => {
    form.setFieldsValue({
      ...initialFormValues,
      ...record,
    });
    setEditingKey(record.id);
  };

  const deleteRow = async (record) => {
    await ScheduleStore.API.eventDelete(dispatch)({
      payload: {
        eventId: record.id,
      },
    });
    ScheduleStore.API.eventsFetchStart(dispatch)();
    const events = await new EventService().getEvents();
    ScheduleStore.API.eventsSet(dispatch)({
      payload: {
        events,
      },
    });
  };

  const addRow = () => {
    setDataSource([initialFormValues, ...dataSource]);
    setEditingKey('new');
  };

  const save = async () => {
    try {
      const newEventData = await form.validateFields();
      if (editingKey === 'new') {
        await ScheduleStore.API.eventCreate(dispatch)({
          payload: {
            // @ts-ignore
            eventData: {
              ...initialFormValues,
              ...newEventData,
            },
          },
        });
        setDataSource(tableData);
      } else {
        await ScheduleStore.API.eventUpdate(dispatch)({
          payload: {
            eventId: editingKey,
            // @ts-ignore
            eventData: {
              ...initialFormValues,
              ...newEventData,
            },
          },
        });
      }
      setEditingKey('');
      form.setFieldsValue(initialFormValues);
    } catch (error) {
      console.log(error);
    }
  };

  const cancel = () => {
    setEditingKey('');
  };

  return (
    <>
      <div className={styles.settings}>
        {userIsMentor && <Button children="+ Add a row" type="primary" onClick={addRow} />}
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
        <Form form={form} component={false}>
          <Table
            className={styles.table}
            components={{
              body: {
                cell: EditableCell,
              },
            }}
            rowKey={(record) => record.id.toString()}
            onRow={(record) => {
              return {
                onClick: (e) => {
                  if ((e.target as HTMLElement).closest('[data-icon="eye-invisible"]')) {
                    hideRows();
                    return;
                  }
                  if ((e.target as HTMLElement).closest('[data-icon="edit"]')) {
                    edit(record);
                    return;
                  }
                  if ((e.target as HTMLElement).closest('[data-icon="delete"]')) {
                    deleteRow(record);
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
                ? dataSource.filter(
                    (data) => !isRowDisabled(data.dateStart, data.dateEnd, data.id) && !hiddenRows.includes(data.id),
                  )
                : dataSource.filter((data) => !hiddenRows.includes(data.id))
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
            scroll={{ x: 1920 }}
            // @ts-ignore
            columns={[
              {
                title: 'Start Date',
                width: 110,
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
                width: 320,
                dataIndex: 'checker',
                render: (value: string, eventData: Event) =>
                  actionButtonsRenderer(value ?? '', eventData, setVisibleDetailViewModal, userIsMentor),
              },
              {
                title: 'Place',
                width: 130,
                dataIndex: 'place',
                render: (value: string) => {
                  return value === 'Youtube Live' ? (
                    <div>
                      <YoutubeOutlined /> {value}{' '}
                      <Tooltip title="Link will be in Discord">
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
                title: 'Organizers',
                width: 120,
                dataIndex: 'organizers',
                render: (value: Array<string>) => organizerRenderer(value),
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
                render: (value: string) => {
                  return <div className={styles.cutted}>{value}</div>;
                },
              },
            ]
              .filter((column) => checkedColumns.includes(column.title))
              .map((column) => {
                return {
                  ...column,
                  onCell: (record) => ({
                    record,
                    cancel,
                    save,
                    editing: isEditing(record),
                    dataIndex: column.dataIndex,
                  }),
                };
              })}
          />
        </Form>
      )}
      <ScheduleDetailViewModal isVisible={isVisibleDetailViewModal} changeVisibility={setVisibleDetailViewModal} />
    </>
  );
}

export const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('DD.MM.YYYY HH:mm') : '';

const actionButtonsRenderer = (
  checker: string,
  eventData: Event,
  setVisibleDetailViewModal: React.Dispatch<null | boolean>,
  userIsMentor: boolean,
) => {
  const { dispatch } = React.useContext(ScheduleStore.context);

  const ButtonDetails = React.useMemo(
    () => (
      <Button
        type={'primary'}
        className={styles.btn}
        children="Details"
        href={`/course/schedule/event/${eventData.id}`}
        target="_blank"
        onClick={(event) => {
          event.preventDefault();
          ScheduleStore.API.detailViewSetOpened(dispatch)({
            payload: {
              openedId: eventData.id,
            },
          });
          ScheduleStore.API.detailViewModeChange(dispatch)({
            payload: {
              mode: NSchedule.FormModes.VIEW,
            },
          });
          setVisibleDetailViewModal(true);
        }}
      />
    ),
    [eventData.id],
  );

  const ButtonSubmit = (
    <Button
      type={'primary'}
      className={`${styles.btn} ${styles.submit}`}
      children="Submit"
      href={'/course/student/cross-check-submit?course=test-course'}
      target="_blank"
    />
  );

  const ButtonAutoTest = (
    <Button
      type={'primary'}
      className={`${styles.btn} ${styles.check}`}
      children="Auto-Test"
      href={'/course/student/auto-test?course=test-course'}
      target="_blank"
    />
  );

  const ButtonCrossCheck = (
    <Button
      type={'primary'}
      className={`${styles.btn} ${styles.check}`}
      children="Crosscheck"
      href={'/course/student/cross-check-review?course=test-course'}
      target="_blank"
    />
  );

  const icons = (
    <>
      <Tooltip title="Hide row">
        <EyeInvisibleOutlined className={styles.iconHide} />
      </Tooltip>
      {userIsMentor && (
        <>
          <Tooltip title="Edit event">
            <EditOutlined className={styles.iconEdit} />
          </Tooltip>
          <Tooltip title="Delete event">
            <DeleteOutlined className={styles.iconDelete} />
          </Tooltip>
        </>
      )}
    </>
  );

  switch (checker) {
    case 'crosscheck':
      return (
        <>
          {ButtonDetails}
          {ButtonSubmit}
          {ButtonCrossCheck}
          {icons}
        </>
      );
    case 'auto-test':
      return (
        <>
          {ButtonDetails}
          {ButtonAutoTest}
          {icons}
        </>
      );
    case 'mentor':
      return (
        <>
          {ButtonDetails}
          {ButtonSubmit}
          {icons}
        </>
      );
    default:
      return (
        <>
          {ButtonDetails}
          {icons}
        </>
      );
  }
};

const organizerRenderer = (organizers: Array<string>) => {
  if (organizers && organizers.length) {
    return (
      <>
        {organizers.map((organizer) => (
          <GithubUserLink value={organizer} />
        ))}
      </>
    );
  }
  return '';
};
