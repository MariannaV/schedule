import React from 'react';
import { Row, Select, Switch, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageLayout } from 'components';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';
import { NSchedule } from 'components/Schedule/store/@types';
import { ScheduleStore, API_Schedule } from 'components/Schedule/store';
import { API_Events } from 'services/event';

enum View {
  table = 'Table',
  list = 'List',
  calendar = 'Calendar',
}

function SchedulePage() {
  const [currentView, changeView] = React.useState<View>(View.table);

  const ScheduleView = React.useCallback(() => {
    switch (currentView) {
      case View.list:
        return <ScheduleListWrapper />;
      case View.calendar:
        return <ScheduleCalendar />;
      case View.table:
      default:
        return <ScheduleTable />;
    }
  }, [currentView]);

  return (
    <ScheduleStore.provider>
      <PageLayout title="Schedule" githubId={'props.session.githubId'} loading={false}>
        <ScheduleHeader onChangeViewMode={changeView} />
        <ScheduleView />
      </PageLayout>
      <FetcherCommonData />
    </ScheduleStore.provider>
  );
}

interface IScheduleHeader {
  onChangeViewMode: (nextView: View) => void;
}

const ScheduleHeader = React.memo((props: IScheduleHeader) => {
  const { store, dispatch } = React.useContext(ScheduleStore.context),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor);

  const onToggleUserMode = React.useCallback(() => {
      API_Schedule.userRoleChange(dispatch)({
        payload: {
          role:
            store.user.role === NSchedule.UserRoles.MENTOR ? NSchedule.UserRoles.STUDENT : NSchedule.UserRoles.MENTOR,
        },
      });
    }, [store.user.role]),
    onChangeTimeZone = React.useCallback(() => {
      API_Schedule.userRoleChange(dispatch)({
        payload: {
          role:
            store.user.role === NSchedule.UserRoles.MENTOR ? NSchedule.UserRoles.STUDENT : NSchedule.UserRoles.MENTOR,
        },
      });
    }, [store.user.role]);

  const fileFormatsToSave = (
    <Menu>
      <Menu.Item key="1" onClick={() => alert(`saving to PDF`)}>
        to PDF format
      </Menu.Item>
      <Menu.Item key="2" onClick={() => alert(`saving to XLS`)}>
        to XLS format
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone
          style={{ width: 200, marginRight: '250px' }}
          defaultValue={store.user.timeZone}
          onChange={onChangeTimeZone}
        />
        <Dropdown.Button overlay={fileFormatsToSave} icon={<DownloadOutlined />}>
          Download
        </Dropdown.Button>
        <Select
          style={{ width: 200 }}
          placeholder="Please Select View"
          defaultValue={View.table}
          onChange={props.onChangeViewMode}
        >
          <Select.Option value={View.table}>Table</Select.Option>
          <Select.Option value={View.list}>List</Select.Option>
          <Select.Option value={View.calendar}>Calendar</Select.Option>
        </Select>
      </Row>
      <Row justify="end" style={{ marginBottom: '10px' }}>
        <Switch
          checkedChildren="mentor"
          unCheckedChildren="student"
          defaultChecked={isMentor}
          onClick={onToggleUserMode}
        />
      </Row>
    </>
  );
});

function FetcherCommonData() {
  API_Events.hooks.useEventsData();
  return null;
}

export default SchedulePage;
