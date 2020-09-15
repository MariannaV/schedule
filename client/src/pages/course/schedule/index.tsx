import React from 'react';
import { Row, Select, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { PageLayout } from 'components';
import { useState } from 'react';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';

export function SchedulePage() {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);

  const [viewOfView, changeView] = useState('table');

  const fileFormats = (
    <Menu>
      <Menu.Item key="1" onClick={() => alert(`saving to PDF`)}>
        to PDF format
      </Menu.Item>
      <Menu.Item key="2" onClick={() => alert(`saving to TXT`)}>
        to TXT format
      </Menu.Item>
      <Menu.Item key="3" onClick={() => alert(`saving to CSV`)}>
        to CSV format
      </Menu.Item>
    </Menu>
  );

  const ScheduleHeader = () => {
    return (
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone style={{ width: 200 }} defaultValue={timeZone} onChange={setTimeZone} />

        <Dropdown.Button overlay={fileFormats} icon={<DownloadOutlined />}>
          Download
        </Dropdown.Button>

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
