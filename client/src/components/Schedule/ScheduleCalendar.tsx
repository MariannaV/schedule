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

  //   ol, ul, dl {
  //     margin-top: 0;
  //     margin-bottom: 0;
  //     margin-left: 0;
  //     padding-inline-start: 0;
  // }

  function getListData(value) {
    console.log('eventsData', eventsData);

    let listData;
    // days.forEach((index) => {
    //   if(value.date()+1 == days[index] && value.month()+1 == months[index] ){
    //     if(eventsData[index].deadLine){
    //       listData = [
    //         { type: 'error', content: `${eventsData[index].name}` },
    //       ];
    //     }else{
    //       listData = [
    //         { type: 'success', content: `${eventsData[index].name}` },
    //       ];
    //     }

    // }
    // });
    for (let index = 0; index < days.length; index++) {
      if (value.date() + 1 == days[index] && value.month() + 1 == months[index]) {
        if (eventsData[index].deadLine) {
          listData = [{ type: 'error', content: `${eventsData[index].name}` }];
        } else {
          listData = [{ type: 'success', content: `${eventsData[index].name}` }];
        }
      }
    }

    return listData || [];
  }

  function dateCellRender(value) {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: 'none' }}>
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
