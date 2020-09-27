import React from 'react';
import { Row, Select, Switch, Menu, Dropdown } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PageLayout } from 'components';
import { FieldTimezone } from 'components/Forms/fields';
import { ScheduleTable, ScheduleListWrapper, ScheduleCalendar } from 'components/Schedule';
import { NSchedule } from 'components/Schedule/store/@types';
import { ScheduleStore } from 'components/Schedule/store';
import { EventService } from 'services/event';
import pageScheduleStyles from 'components/Schedule/SchedulePage.module.scss';

const SchedulePageWrapper = () => (
  <ScheduleStore.provider>
    <FetcherCommonData />
    <SchedulePage />
  </ScheduleStore.provider>
);

function SchedulePage() {
  const isLoading = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsLoading);
  return (
    <PageLayout
      title="Schedule"
      githubId={'props.session.githubId'}
      loading={isLoading}
      classes={pageScheduleStyles.pageSchedule}
    >
      {isLoading === false && (
        <>
          <ScheduleHeader />
          <ScheduleView />
        </>
      )}
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
    scheduleView = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredScheduleView),
    isActiveDates = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsActiveDates),
    eventsMap = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsMap);

  const onToggleUserMode = React.useCallback(() => {
      ScheduleStore.API.userRoleChange(dispatch)({
        payload: {
          role: userRole === NSchedule.UserRoles.MENTOR ? NSchedule.UserRoles.STUDENT : NSchedule.UserRoles.MENTOR,
        },
      });
    }, [userRole]),
    onChangeTimeZone = React.useCallback((timeZone: NSchedule.IStore['user']['timeZone']) => {
      ScheduleStore.API.userTimeZoneChange(dispatch)({
        payload: {
          timeZone,
        },
      });
    }, []),
    onChangeScheduleView = React.useCallback((scheduleView: NSchedule.IStore['user']['scheduleView']) => {
      ScheduleStore.API.userScheduleViewChange(dispatch)({
        payload: {
          scheduleView,
        },
      });
    }, []),
    onToggleActiveDates = React.useCallback(() => {
      ScheduleStore.API.isActiveDatesSet(dispatch)({
        payload: {
          isActiveDates: !isActiveDates,
        },
      });
    }, [isActiveDates]);

  const fileFormatsToSave = (
    <Menu>
      <Menu.Item key="pdf" onClick={convertToPDF}>
        to PDF format
      </Menu.Item>
      <Menu.Item key="txt" onClick={() => downloadTxtFile(eventsMap)}>
        to TXT format
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <Row justify="space-between" style={{ marginBottom: 16 }}>
        <FieldTimezone
          style={{ width: 200, marginRight: '250px' }}
          defaultValue={timeZone}
          onChange={onChangeTimeZone}
        />
        <Dropdown.Button overlay={fileFormatsToSave} icon={<DownloadOutlined />}>
          Download
        </Dropdown.Button>
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
      <Row justify="space-between" style={{ marginBottom: 10 }}>
        <Switch
          checkedChildren="Only active"
          unCheckedChildren="All events"
          defaultChecked={isActiveDates}
          onClick={onToggleActiveDates}
        />
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

export function FetcherCommonData() {
  const { dispatch } = React.useContext(ScheduleStore.context);

  React.useEffect(function fetchData() {
    fetchEventsData();

    async function fetchEventsData() {
      try {
        ScheduleStore.API.eventsFetchStart(dispatch)();
        const events = await new EventService().getEvents();
        ScheduleStore.API.eventsSet(dispatch)({
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

function convertToPDF() {
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

function downloadTxtFile(eventsMap) {
  const element = document.createElement('a');
  const contenttxt = Object.keys(eventsMap).map(
    (key) =>
      `
    ${eventsMap[key].type}: ${eventsMap[key].name}\r
    Date: ${eventsMap[key].dateTime} (timeZone: ${eventsMap[key].timeZone})\r
    Place: ${eventsMap[key].place}\r
    Description: ${eventsMap[key].description}\r
    -------------------------------------------\r
    `,
  );
  const file = new Blob(contenttxt, { type: 'text/plain' });
  element.href = URL.createObjectURL(file);
  element.download = 'RSFile.txt';
  document.body.appendChild(element); // Required for this to work in FireFox
  element.click();
}

export default SchedulePageWrapper;
