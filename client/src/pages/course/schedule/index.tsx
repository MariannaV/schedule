import React from 'react';
import { Row, Select, Switch } from 'antd';
import { PageLayout } from 'components';
import { useState } from 'react';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';
import { StateContext, ScheduleContext } from 'components/Schedule/context';

export function SchedulePage() {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  // const onChangeViewMode = React.useCallback((value) => changeView(value), []);
  // const onToggleMentorMode = React.useCallback(() => changeMentorMode((state) => !state), []);

  const ScheduleHeader = React.useCallback((data) => {
    return (
      <>
        <Row justify="space-between" style={{ marginBottom: 16 }}>
          <FieldTimezone style={{ width: 200, marginRight: '250px' }} defaultValue={timeZone} onChange={setTimeZone} />
          <Select
            style={{ width: 200 }}
            placeholder="Please Select View"
            defaultValue={data.view}
            onChange={(value) => data.changeViewMode(value)}
          >
            <Select.Option value="table">Table</Select.Option>
            <Select.Option value="list">List</Select.Option>
            <Select.Option value="calendar">Calendar</Select.Option>
          </Select>
        </Row>
        <Row justify="end" style={{ marginBottom: '10px' }}>
          <Switch
            checkedChildren="mentor"
            unCheckedChildren="student"
            defaultChecked={data.mentorMode}
            onClick={() => data.toggleMentorMode()}
          />
        </Row>
      </>
    );
  }, []);

  const ScheduleView = React.useCallback((data) => {
    switch (data.view) {
      case 'list':
        return <ScheduleListWrapper />;
      case 'calendar':
        return <ScheduleCalendar />;
      case 'table':
      default:
        return <ScheduleTable timeZone={timeZone} />;
    }
  }, []);

  return (
    <StateContext>
      <ScheduleContext.Consumer>
        {(schedulecontext) => {
          return (
            <PageLayout title="Schedule" githubId={'props.session.githubId'} loading={false}>
              <ScheduleHeader
                changeViewMode={schedulecontext.changeViewMode}
                toggleMentorMode={schedulecontext.toggleMentorMode}
                view={schedulecontext.view}
                mentorMode={schedulecontext.mentorMode}
              />
              <ScheduleView view={schedulecontext.view} />
            </PageLayout>
          );
        }}
      </ScheduleContext.Consumer>
    </StateContext>
  );
}

export default SchedulePage;
