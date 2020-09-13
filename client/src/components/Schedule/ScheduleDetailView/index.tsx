import React from 'react';
import { ScheduleStore } from 'components/Schedule/store';
import viewStyles from './ScheduleDetailView.module.scss';
import { EventForm } from './EventForm';

interface IScheduleDetailView {
  className?: string;
}

export const ScheduleDetailView: React.FC<IScheduleDetailView> = React.memo((props) => {
  const openedItem = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId: openedItem }));

  return (
    <section className={[viewStyles.ScheduleDetailView, props.className].filter(Boolean).join(' ')}>
      <EventForm formData={eventData} eventId={openedItem} />
    </section>
  );
});
