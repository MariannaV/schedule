import React from 'react';
import { Button, Typography, Tag } from 'antd';
import moment from 'moment-timezone';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Event } from 'services/event';
import { tagColors } from '../constants';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import listStyles from './ScheduleList.module.scss';

interface IScheduleList {
  className?: string;
}

function ScheduleList(props: IScheduleList) {
  const eventsList = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsList),
    renderEventItem = React.useCallback(
      ({ index, ...rest }: any) => <ListItem {...rest} eventId={eventsList[index]} />,
      [eventsList],
    ),
    getRowKey = React.useCallback((index) => eventsList[index], [eventsList]),
    renderEventList = React.useCallback(
      ({ height, width }) => (
        <List
          className="List"
          itemKey={getRowKey}
          itemCount={eventsList.length}
          itemSize={200}
          width={width}
          height={height}
          children={renderEventItem}
        />
      ),
      [],
    ),
    classes = React.useMemo(() => [listStyles.ScheduleListWrapper, props.className].filter(Boolean).join(' '), [
      props.className,
    ]);

  return (
    <section className={classes}>
      <ScheduleListHeader />
      <AutoSizer children={renderEventList} />
    </section>
  );
}

interface IListItem {
  eventId: Event['id'];
  style: any;
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
    ),
    containerStyle = React.useMemo(() => {
      const verticalMargin = 8;
      return {
        ...props.style,
        top: props.style.top + verticalMargin,
        height: props.style.height - verticalMargin,
      };
    }, [props.style]);

  return (
    <article className={classes} onClick={onItemClick} style={containerStyle}>
      <header>
        <Typography.Title children={eventData.name} level={3} />
        <Tag color={tagColors[eventData.type.toLowerCase()]}>{eventData.type}</Tag>
      </header>

      <main>
        <Typography.Text children={eventData.description} className={listStyles.description} />
      </main>

      <footer>
        <Typography.Text className={listStyles.dateStart}>
          <span children="Start: " />
          <Date date={eventData.dateStart} />
        </Typography.Text>
        {eventData.dateEnd && (
          <Typography.Text className={listStyles.dateDeadline}>
            <span children="Deadline: " />
            <Date date={eventData.dateEnd} />
          </Typography.Text>
        )}
      </footer>
    </article>
  );
}

function Date(props: { date: string }) {
  const timeZone = ScheduleStore.useSelector(ScheduleStore.selectors.getUserPreferredTimezone),
    formattedDate = React.useMemo(
      () => moment(props.date, 'YYYY-MM-DD HH:mmZ').tz(timeZone).format('DD.MM.YYYY HH:mm'),
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
