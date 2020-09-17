import React from 'react';
import { Button, Typography, Tag } from 'antd';
import moment from 'moment-timezone';
import { Event, EventTypeColor, EventTypeToName } from 'services/event';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import listStyles from './ScheduleList.module.scss';

interface IScheduleList {
  className?: string;
}

function ScheduleList(props: IScheduleList) {
  const eventsList = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsList),
    eventItems = React.useMemo(() => eventsList.map((eventId) => <ListItem eventId={eventId} key={eventId} />), [
      eventsList,
    ]),
    classes = React.useMemo(() => [listStyles.ScheduleListWrapper, props.className].filter(Boolean).join(' '), [
      props.className,
    ]);

  return (
    <section className={classes}>
      <ScheduleListHeader />
      <section className={listStyles.ScheduleList} children={eventItems} />
    </section>
  );
}

interface IListItem {
  eventId: Event['id'];
}

function ListItem(props: IListItem) {
  const { eventId } = props,
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId })),
    { dispatch } = React.useContext(ScheduleStore.context);

  const onItemClick = React.useCallback(() => {
    ScheduleStore.API.detailViewModeChange(dispatch)({
      payload: {
        mode: NSchedule.FormModes.VIEW,
      },
    });
    ScheduleStore.API.detailViewSetOpened(dispatch)({
      payload: {
        openedId: eventId,
      },
    });
  }, [eventId]);

  const openedEventId = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    classes = React.useMemo(
      () => [listStyles.ScheduleListItem, eventId === openedEventId && listStyles.isOpened].filter(Boolean).join(' '),
      [eventId, openedEventId],
    );

  return (
    <article className={classes} onClick={onItemClick}>
      <header>
        <Typography.Title children={eventData.name} level={3} />
        <Tag color={EventTypeColor[eventData.type]}>{EventTypeToName[eventData.type] || eventData.type}</Tag>
      </header>

      <main>
        <Typography.Text children={eventData.description} />
      </main>

      <footer>
        <Typography.Text className={listStyles.dateStart}>
          <span children="Start: " />
          <Date date={eventData.dateTime} />
        </Typography.Text>
        {eventData.deadLine && (
          <Typography.Text className={listStyles.dateDeadline}>
            <span children="Deadline: " />
            <Date date={eventData.deadLine} />
          </Typography.Text>
        )}
      </footer>
    </article>
  );
}

function Date(props: { date: string }) {
  const timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    formattedDate = React.useMemo(
      () => moment(props.date, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('YYYY-MM-DD HH:mm'),
      [props.date, timeZone],
    );

  return <>{formattedDate}</>;
}

function ScheduleListHeader() {
  const { dispatch } = React.useContext(ScheduleStore.context),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    eventsList = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsList),
    onCreateNewClick = React.useCallback(() => {
      ScheduleStore.API.detailViewModeChange(dispatch)({
        payload: {
          mode: NSchedule.FormModes.CREATE,
        },
      });
      ScheduleStore.API.detailViewSetOpened(dispatch)({
        payload: {
          openedId: null,
        },
      });
    }, []);

  return (
    <header className={listStyles.ScheduleListHeader}>
      <Typography.Title
        children="Events"
        level={3}
        data-events-amount={eventsList.length}
        className={listStyles.ScheduleListHeaderTitle}
      />
      {isMentor && <Button children="+ Create new" type="primary" onClick={onCreateNewClick} />}
    </header>
  );
}

export { ScheduleList };
