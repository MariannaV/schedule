import React from 'react';
import { Row, Select, Switch, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
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

function converttoPDF() {
  const myinput = document.getElementById(`__next`);
  if (!myinput) return;
  html2canvas(myinput).then((canvas) => {
    const pdfWidth = window.innerWidth;
    const pdfHeight = myinput.offsetHeight;
    const imgData = canvas.toDataURL('image/jpeg', 0.5);
    const orientation = pdfWidth > pdfHeight ? 'l' : 'p';
    const pixelratio = 3.7 / window.devicePixelRatio;
    const pdf = new jsPDF(orientation, 'mm', [pdfWidth / pixelratio, pdfHeight / pixelratio]);
    pdf.addImage(imgData, 'JPG', 0, 0, pdfWidth / pixelratio, pdfHeight / pixelratio, undefined, undefined, 0);
    pdf.save(`RSFile.pdf`);
  });
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
        <div id="xxx">
          <ScheduleHeader onChangeViewMode={changeView} />
          <ScheduleView />
        </div>
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
      <Menu.Item key="1" onClick={() => converttoPDF()}>
        to PDF format
      </Menu.Item>
      <Menu.Item key="2" onClick={() => alert(`saving to TXT`)}>
        to TXT format
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
