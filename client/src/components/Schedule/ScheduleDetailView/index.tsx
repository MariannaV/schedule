import { API_Events, Event } from 'services/event';
import viewStyles from './ScheduleDetailView.module.scss';
import { EventForm } from './EventForm';

interface IScheduleDetailView {
  eventId: Event['id'];
  classes?: Array<string>;
}

export function ScheduleDetailView(props: IScheduleDetailView) {
  const { eventId } = props,
    { eventData } = API_Events.hooks.useEventData({ eventId });

  return (
    <section className={[viewStyles.ScheduleDetailView, props.classes].filter(Boolean).join(' ')}>
      <EventForm formData={eventData!} eventId={eventId} />
    </section>
  );
}
