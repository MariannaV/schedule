import React from 'react';
import { Row, Select } from 'antd';
import { PageLayout } from 'components';
import { useState } from 'react';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';

export function SchedulePage() {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [viewOfView, changeView] = useState('table');

  const ScheduleHeader = () => {
    return (
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone style={{ width: 200 }} defaultValue={timeZone} onChange={setTimeZone} />
        <Select
          style={{ width: 200 }}
          placeholder="Please Select View"
          defaultValue={viewOfView}
          onChange={(value) => changeView(value)}
        >
          <Select.Option value="table">Table</Select.Option>
          <Select.Option value="list">List</Select.Option>
          <Select.Option value="calendar">Calendar</Select.Option>
        </Select>
      </Row>
    );
  };

  const ScheduleView = () => {
    switch (viewOfView) {
      case 'list':
        return <ScheduleListWrapper />;
      case 'calendar':
        return <ScheduleCalendar />;
      case 'table':
      default:
        return <ScheduleTable timeZone={timeZone} />;
    }
  };

  return (
    <PageLayout title="Schedule" githubId={'props.session.githubId'} loading={false}>
      <ScheduleHeader />
      <ScheduleView />
    </PageLayout>
  );
}

export default SchedulePage;
