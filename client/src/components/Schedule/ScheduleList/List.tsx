import React from 'react';
import { Button, Typography, Tag } from 'antd';
import moment from 'moment';
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
        <Typography.Text children={`Start: ${formatDate(eventData.dateTime)}`} className={listStyles.dateStart} />
        {eventData.deadLine && (
          <Typography.Text
            children={`Deadline: ${formatDate(eventData.deadLine)}`}
            className={listStyles.dateDeadline}
          />
        )}
      </footer>
    </article>
  );

  function formatDate(date) {
    return moment(date, 'YYYY-MM-DD HH:mm').format('DD.MM.YYYY HH:mm');
  }
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
