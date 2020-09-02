import { Button, Form, Input, message, Typography } from 'antd';
import { PageLayoutSimple, UserSearch } from 'components';
import withCourseData from 'components/withCourseData';
import withSession from 'components/withSession';
import { useMemo, useState } from 'react';
import { useAsync } from 'react-use';
import { CourseService } from 'services/course';
import { CoursePageProps, StudentBasic } from 'services/models';

function Page(props: CoursePageProps) {
  const courseId = props.course.id;
  const roles = props.session.roles;
  const userGithubId = props.session.githubId;

  const [form] = Form.useForm();
  const courseService = useMemo(() => new CourseService(courseId), [courseId]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([] as StudentBasic[]);

  useAsync(async () => {
    if (roles[courseId] === 'student') {
      const student = await courseService.getStudentSummary(userGithubId);
      if (student.isActive) {
        setStudents([
          Object.assign(student, {
            id: props.session.id,
            githubId: props.session.githubId,
            name: props.session.githubId,
          }),
        ]);
      }
    } else {
      const students = await courseService.getMentorStudents();
      const activeStudents = students.filter((student) => student.isActive);
      setStudents(activeStudents);
    }
  }, [courseId]);

  const handleSubmit = async (values: any) => {
    if (!values.githubId || loading) {
      return;
    }
    try {
      setLoading(true);
      if (values.githubId === userGithubId) {
        await courseService.selfExpel(values.githubId, values.comment);
      } else {
        await courseService.expelStudent(values.githubId, values.comment);
      }

      const activeStudents = students.filter((s) => s.githubId !== values.githubId);
      setStudents(activeStudents);
      form.resetFields();
      message.success('The student has been expelled');
    } catch (e) {
      message.error('An error occured. Please try later.');
    } finally {
      setLoading(false);
    }
  };

  const noData = !students.length;

  return (
    <PageLayoutSimple
      loading={loading}
      title="Expel Student"
      githubId={props.session.githubId}
      courseName={props.course.name}
    >
      <Typography.Paragraph type="warning">This page allows to expel a student from the course</Typography.Paragraph>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item name="githubId" label="Student" rules={[{ required: true, message: 'Please select a student' }]}>
          <UserSearch
            keyField="githubId"
            defaultValues={students}
            disabled={noData}
            placeholder={noData ? 'No Students' : undefined}
          />
        </Form.Item>

        <Form.Item
          name="comment"
          label="Reason for expelling"
          rules={[{ required: true, message: 'Please give us a couple words why you are expelling the student' }]}
        >
          <Input.TextArea rows={5} />
        </Form.Item>

        <Button size="large" type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </PageLayoutSimple>
  );
}

export default withCourseData(withSession(Page, 'mentor'));
