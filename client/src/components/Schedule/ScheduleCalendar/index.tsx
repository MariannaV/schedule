import React from 'react';
import moment from 'moment-timezone';
import { Button, Calendar, Badge } from 'antd';
import { Event } from 'services/event';
import { ScheduleStore } from 'components/Schedule/store';
import {
  ScheduleDetailViewModal,
  IScheduleDetailViewModal,
} from 'components/Schedule/ScheduleDetailView/ScheduleDetailViewModal';
import calendarStyles from './ScheduleCalendar.module.scss';

export function ScheduleCalendar() {
  const timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    eventsMap = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsMap),
    eventTypesByDate = React.useMemo(
      () =>
        (Object.values(eventsMap) as Array<Event>).reduce((acc, currentEvent) => {
          const currentType = dateRenderer(currentEvent.timeZone)(currentEvent.dateStart);
          if (!(currentType in acc)) acc[currentType] = [];
          acc[currentType].push(currentEvent.type);
          return acc;
        }, {} as Record<string, Array<Event['type']>>),
      [eventsMap],
    ),
    eventIdsByDate = React.useMemo(
      () =>
        (Object.values(eventsMap) as Array<Event>).reduce((acc, currentEvent) => {
          const currentDate = dateRenderer(currentEvent.timeZone)(currentEvent.dateStart);
          if (!(currentDate in acc)) acc[currentDate] = [];
          acc[currentDate].push(currentEvent.id);
          return acc;
        }, {} as Record<string, Array<Event['id']>>),
      [eventsMap],
    );

  const [isVisibleDetailViewModal, setVisibleDetailViewModal] = React.useState<IScheduleDetailViewModal['isVisible']>(
    null,
  );

  function dateCellRender(value) {
    const currentDate = dateRenderer(timeZone)(value),
      isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
      currentEvents = eventIdsByDate[currentDate];
    const currentTypes = eventTypesByDate[currentDate];

    return (
      <section>
        {isMentor && <Button children="+" type="primary" size="small" />}
        {currentEvents?.map((eventId, index) => (
          <section className={calendarStyles[currentTypes[index].toLowerCase()]}>
            <CalendarEvent eventId={eventId} key={eventId} changeVisibility={setVisibleDetailViewModal} />
          </section>
        ))}
      </section>
    );
  }

  return (
    <>
      <Calendar className={calendarStyles.calendar} dateCellRender={dateCellRender} />
      <ScheduleDetailViewModal isVisible={isVisibleDetailViewModal} changeVisibility={setVisibleDetailViewModal} />
    </>
  );
}

interface ICalendarEvent extends Pick<IScheduleDetailViewModal, 'changeVisibility'> {
  eventId: Event['id'];
}

function CalendarEvent(props: ICalendarEvent) {
  const { eventId, changeVisibility } = props,
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const { dispatch } = React.useContext(ScheduleStore.context),
    onClick = React.useCallback(() => {
      ScheduleStore.API.detailViewSetOpened(dispatch)({
        payload: {
          openedId: eventId,
        },
      });
      changeVisibility(true);
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

const dateRenderer = (timeZone: string) => (value: string) =>
  value ? moment(value, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('YYYY-MM-DD') : '';
