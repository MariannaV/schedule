import React from 'react';
import { Row, Select, Switch } from 'antd';
import { PageLayout } from 'components';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';
import { NSchedule } from 'components/Schedule/store/@types';
import { ScheduleStore, API_Schedule } from 'components/Schedule/store';
import { EventService } from 'services/event';

const SchedulePageWrapper = () => (
  <ScheduleStore.provider>
    <FetcherCommonData />
    <SchedulePage />
  </ScheduleStore.provider>
);

function SchedulePage() {
  const isLoading = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsLoading);
  return (
    <PageLayout title="Schedule" githubId={'props.session.githubId'} loading={isLoading}>
      <ScheduleHeader />
      <ScheduleView />
    </PageLayout>
  );
}

const ScheduleView = React.memo(() => {
  const scheduleView = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredScheduleView);
  switch (scheduleView) {
    case NSchedule.ScheduleView.list:
      return <ScheduleListWrapper />;
    case NSchedule.ScheduleView.calendar:
      return <ScheduleCalendar />;
    case NSchedule.ScheduleView.table:
    default:
      return <ScheduleTable />;
  }
});

const ScheduleHeader = React.memo(() => {
  const { dispatch } = React.useContext(ScheduleStore.context),
    userRole = ScheduleStore.useSelector(ScheduleStore.selectors.getUserRole),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    scheduleView = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredScheduleView);

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
    }, []),
    onChangeScheduleView = React.useCallback((scheduleView: NSchedule.IStore['user']['scheduleView']) => {
      API_Schedule.userScheduleViewChange(dispatch)({
        payload: {
          scheduleView,
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
          defaultValue={scheduleView}
          onChange={onChangeScheduleView}
        >
          <Select.Option value={NSchedule.ScheduleView.table} children="Table" />
          <Select.Option value={NSchedule.ScheduleView.list} children="List" />
          <Select.Option value={NSchedule.ScheduleView.calendar} children="Calendar" />
        </Select>
      </Row>
      <Row justify="end" style={{ marginBottom: '10px' }}>
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
  const { dispatch } = React.useContext(ScheduleStore.context);

  React.useEffect(function fetchData() {
    fetchEventsData();

    async function fetchEventsData() {
      try {
        API_Schedule.eventsFetchStart(dispatch)();
        const events = await new EventService().getEvents();
        API_Schedule.eventsSet(dispatch)({
          payload: {
            events,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  return null;
}

export default SchedulePageWrapper;
