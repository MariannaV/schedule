import { Spin } from 'antd';
import { API_Events, Event } from 'services/event';
import viewStyles from './ScheduleDetailView.module.scss';

interface IScheduleDetailView {
  eventId: Event['id'];
  classes?: Array<string>;
}

export function ScheduleDetailView(props: IScheduleDetailView) {
  const { eventId } = props,
    { eventData, eventLoading } = API_Events.hooks.useEventData({ eventId });

  return (
    <section className={[viewStyles.ScheduleDetailView, props.classes].filter(Boolean).join(' ')}>
      {eventLoading === false ? (
        <>
          <h2>Detail View</h2>
          {console.log('@@', eventData)}
        </>
      ) : (
        <Spin wrapperClassName={viewStyles.spinner} />
      )}
    </section>
  );
}
