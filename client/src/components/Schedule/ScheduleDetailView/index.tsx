import React from 'react';
import viewStyles from './ScheduleDetailView.module.scss';
import { ScheduleDetailViewHeader } from './ScheduleDetailViewHeader';
import { EventForm } from './EventForm';
import { EventComments } from './EventComments';

interface IScheduleDetailView {
  className?: string;
}

export const ScheduleDetailView: React.FC<IScheduleDetailView> = React.memo((props) => {
  const classes = React.useMemo(() => [viewStyles.ScheduleDetailView, props.className].filter(Boolean).join(' '), [
      props.className,
    ]),
    [isSubmitting, setSubmitting] = React.useState<null | boolean>(null);

  return (
    <section className={classes}>
      <ScheduleDetailViewHeader isSubmitting={isSubmitting} />
      <EventForm setSubmitting={setSubmitting} />
      <EventComments />
    </section>
  );
});
