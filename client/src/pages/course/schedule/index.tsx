import { Row, Select } from 'antd';
import { withSession, PageLayout } from 'components';
import withCourseData from 'components/withCourseData';
import { useState, useMemo } from 'react';
import { CourseService } from 'services/course';
import { CoursePageProps } from 'services/models';
import { TIMEZONES } from 'configs/timezones';
import { ScheduleTable, ScheduleList, ScheduleCalendar } from 'components/Schedule';

export function SchedulePage(props: CoursePageProps) {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone),
    courseService = useMemo(() => new CourseService(props.course.id), [props.course.id]);

  const [viewOfView, changeView] = useState('table');

  const ScheduleHeader = () => {
    return (
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Please select a timezone"
          defaultValue={timeZone}
          onChange={setTimeZone}
        >
          {TIMEZONES.map((tz) => (
            <Select.Option key={tz} value={tz}>
              {tz}
            </Select.Option>
          ))}
        </Select>
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
        return <ScheduleList />;
      case 'calendar':
        return <ScheduleCalendar />;
      case 'table':
      default:
        return <ScheduleTable timeZone={timeZone} />;
    }
  };

  return (
    <PageLayout title="Schedule" githubId={props.session.githubId} loading={false}>
      <ScheduleHeader />
      <ScheduleView />
    </PageLayout>
  );
}

export default withCourseData(withSession(SchedulePage));
