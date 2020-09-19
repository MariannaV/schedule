import React from 'react';
import { Button, Calendar, Badge } from 'antd';
import { Event } from 'services/event';
import { ScheduleStore } from 'components/Schedule/store';
import { dateRenderer } from 'components/Schedule/ScheduleTable';
import ScheduleStyles from './ScheduleCalendar.module.scss';
import calendarStyles from './ScheduleCalendar.module.scss';

export function ScheduleCalendar({ props }) {
  const { isReadOnly = false, className } = props,
    classes = React.useMemo(
      () => [ScheduleStyles.calendar, isReadOnly && 'isReadOnly', className].filter(Boolean).join(' '),
      [className, isReadOnly],
    );

  const { timeZone } = ScheduleStore.useSelector(ScheduleStore.selectors.getUser),
    eventsMap = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsMap),
    eventTypesByDate = React.useMemo(
      () =>
        (Object.values(eventsMap) as Array<Event>).reduce((acc, currentEvent) => {
          const currentType = dateRenderer(currentEvent.timeZone)(currentEvent.dateTime);
          if (!(currentType in acc)) acc[currentType] = [];
          acc[currentType].push(currentEvent.type);
          return acc;
        }, {} as Record<string, Array<Event['type']>>),
      [eventsMap],
    ),
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
      isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
      currentEvents = eventIdsByDate[currentDate];
    const currentTypes = eventTypesByDate[currentDate];

    if (!currentEvents)
      return (
        <section className="events">
          {isMentor && <Button children="+" type="primary" size="small" onClick={handleMouseClick} />}
        </section>
      );

    console.log(calendarStyles);

    return (
      <section>
        {isMentor && <Button children="+" type="primary" size="small" onClick={handleMouseClick} />}
        {currentEvents.map((eventId, index) => (
          <section className={calendarStyles[currentTypes[index]]}>
            <CalendarEvent eventId={eventId} key={eventId} />
          </section>
        ))}
      </section>
    );
  }

  function handleMouseClick() {
    console.log('click');
  }

  return <Calendar className={classes} dateCellRender={dateCellRender} />;
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
