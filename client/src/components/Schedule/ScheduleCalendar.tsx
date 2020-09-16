import React from 'react';
import { Button, Calendar, Badge } from 'antd';
import { Event } from 'services/event';
import { ScheduleStore } from 'components/Schedule/store';
import { dateRenderer } from 'components/Schedule/ScheduleTable';
import ScheduleStyles from './ScheduleCalendar.module.scss';

export function ScheduleCalendar({ props }) {
  const { isReadOnly = false, className } = props,
    classes = React.useMemo(
      () => [ScheduleStyles.field, isReadOnly && 'isReadOnly', className].filter(Boolean).join(' '),
      [className, isReadOnly],
    );

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

  return (
    <span>
      <Calendar className={classes} dateCellRender={dateCellRender} />
    </span>
  );
}

function CalendarEvent(props: { eventId: Event['id'] }) {
  const { eventId } = props,
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const { dispatch } = React.useContext(ScheduleStore.context),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
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

  function isHovered() {
    if (document.querySelector('ant-picker-cell')) {
      console.log('true');
    }
  }

  function handleMouseEnter() {
    if (document.querySelector('ant-picker-cell')) {
      console.log('true');
    }
  }

  function handleMouseClick() {
    if (document.querySelector('ant-picker-cell')) {
      console.log('true');
    }
  }

  return (
    <article onClick={onClick}>
      {isMentor && isHovered && (
        <Button children="+ Add event" type="primary" onClick={handleMouseClick} onMouseEnter={handleMouseEnter} />
      )}
      <Badge status={type} text={eventData.name} />
    </article>
  );
}
