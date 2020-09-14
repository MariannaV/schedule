import { Calendar, Badge, Spin } from 'antd';
import { API_Events } from 'services/event';

export function ScheduleCalendar() {
  const { eventsData, eventsLoading } = API_Events.hooks.useEventsData();
  if (eventsLoading) return <Spin />;
  const days = [] as any;
  const months = [] as any;
  eventsData.forEach((elem) => {
    const transformed = new Date(elem.dateTime).getDay() + 1;
    days.push(transformed);
  });
  eventsData.forEach((elem) => {
    const transformed = new Date(elem.dateTime).getMonth() + 1;
    months.push(transformed);
  });

  console.log(eventsData);

  function getListData(value) {
    let listData;
    switch (value.date()) {
      case days[0] && months[0]:
        listData = [
          { type: 'warning', content: `${eventsData[0].name}` },
          { type: 'success', content: `${eventsData[0].name}` },
        ];
        break;
      // case 10:
      //   listData = [
      //     { type: 'warning', content: 'This is warning event.' },
      //     { type: 'success', content: 'This is usual event.' },
      //     { type: 'error', content: 'This is error event.' },
      //   ];
      //   break;
      // case 15:
      //   listData = [
      //     { type: 'warning', content: 'This is warning event' },
      //     { type: 'success', content: 'This is very long usual event。。....' },
      //     { type: 'error', content: 'This is error event 1.' },
      //     { type: 'error', content: 'This is error event 2.' },
      //     { type: 'error', content: 'This is error event 3.' },
      //     { type: 'error', content: 'This is error event 4.' },
      //   ];
      //   break;
      default:
    }
    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events">
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  }

  function getMonthData(value) {
    if (value.month() === 8) {
      return 1394;
    }
  }

  function monthCellRender(value) {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  }
  return (
    <section>
      {eventsLoading === false ? (
        <Calendar dateCellRender={dateCellRender} monthCellRender={monthCellRender} />
      ) : (
        <Spin spinning={Boolean(eventsLoading)} />
      )}
    </section>
  );
}
