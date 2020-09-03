import { Row, Select } from 'antd';
import { withSession, PageLayout } from 'components';
import withCourseData from 'components/withCourseData';
import { useState, useMemo } from 'react';
import { CourseService } from 'services/course';
import { CoursePageProps } from 'services/models';
import { TIMEZONES } from 'configs/timezones';
import { ScheduleTable } from 'components/Schedule';

export function SchedulePage(props: CoursePageProps) {
  const [timeZone, setTimeZone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone),
    courseService = useMemo(() => new CourseService(props.course.id), [props.course.id]);

  return (
    <PageLayout title="Schedule" githubId={props.session.githubId} loading={false}>
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
      </Row>
      <ScheduleTable timeZone={timeZone} courseService={courseService} />
    </PageLayout>
  );
}

export default withCourseData(withSession(SchedulePage));
