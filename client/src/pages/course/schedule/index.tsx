import React from 'react';
import { Row, Select, Switch } from 'antd';
import { PageLayout } from 'components';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';
import { NSchedule } from 'components/Schedule/store/@types';
import { ScheduleStore, API_Schedule } from 'components/Schedule/store';

enum View {
  table = 'Table',
  list = 'List',
  calendar = 'Calendar',
}

export function SchedulePage() {
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
    </ScheduleStore.provider>
  );
}

interface IScheduleHeader {
  onChangeViewMode: (nextView: View) => void;
}

const ScheduleHeader = React.memo((props: IScheduleHeader) => {
  const { store, dispatch } = React.useContext(ScheduleStore.context);

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

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone
          style={{ width: 200, marginRight: '250px' }}
          defaultValue={store.user.timeZone}
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
        <Switch
          checkedChildren="mentor"
          unCheckedChildren="student"
          defaultChecked={store.user.isMentor}
          onClick={onToggleUserMode}
        />
      </Row>
    </>
  );
});

export default SchedulePage;
