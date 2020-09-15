import React from 'react';
import { Calendar, Badge } from 'antd';
import { Event } from 'services/event';
import { ScheduleStore } from 'components/Schedule/store';
import { dateRenderer } from 'components/Schedule/ScheduleTable';

export function ScheduleCalendar() {
  const { timeZone } = ScheduleStore.useSelector(ScheduleStore.selectors.getUser),
    eventsMap = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsMap),
    eventIdsByDate = React.useMemo(
      () =>
        (Object.values(eventsMap) as Array<Event>).reduce((acc, currentEvent) => {
          const currentDate = dateRenderer(currentEvent.timeZone)(currentEvent.dateTime);
          if (!(currentDate in acc)) acc[currentDate] = [];
          acc[currentDate].push(currentEvent.id);
          return acc;
        }, {} as Record<string, Array<Event['id']>>),
      [eventsMap],
    );

  function dateCellRender(value) {
    const currentDate = dateRenderer(timeZone)(value),
      currentEvents = eventIdsByDate[currentDate];

    if (!currentEvents) return null;

    return (
      <section className="events">
        {currentEvents.map((eventId) => (
          <CalendarEvent eventId={eventId} key={eventId} />
        ))}
      </section>
    );
  }

  return <Calendar dateCellRender={dateCellRender} />;
}

function CalendarEvent(props: { eventId: Event['id'] }) {
  const { eventId } = props,
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const { dispatch } = React.useContext(ScheduleStore.context),
    onClick = React.useCallback(() => {
      ScheduleStore.API.detailViewSetOpened(dispatch)({
        payload: {
          openedId: eventId,
        },
      });
    }, [eventId]);

  const type = React.useMemo(() => {
    switch (true) {
      case eventData.deadLine:
        return 'error';
      default:
        return 'success';
    }
  }, [eventData.deadLine]);

  return (
    <article onClick={onClick}>
      <Badge status={type} text={eventData.name} />
    </article>
  );
}
