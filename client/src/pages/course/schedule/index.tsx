import React from 'react';
import { Row, Select, Switch } from 'antd';
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
  const { dispatch } = React.useContext(ScheduleStore.context),
    userRole = ScheduleStore.useSelector(ScheduleStore.selectors.getUserRole),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone);

  const onToggleUserMode = React.useCallback(() => {
      API_Schedule.userRoleChange(dispatch)({
        payload: {
          role: userRole === NSchedule.UserRoles.MENTOR ? NSchedule.UserRoles.STUDENT : NSchedule.UserRoles.MENTOR,
        },
      });
    }, [userRole]),
    onChangeTimeZone = React.useCallback((timeZone: NSchedule.IStore['user']['timeZone']) => {
      API_Schedule.userTimeZoneChange(dispatch)({
        payload: {
          timeZone,
        },
      });
    }, []);

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone
          style={{ width: 200, marginRight: '250px' }}
          defaultValue={timeZone}
          onChange={onChangeTimeZone}
        />
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
        {console.log('@@', timeZone)}
        <Switch
          unCheckedChildren="student"
          checkedChildren="mentor"
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
