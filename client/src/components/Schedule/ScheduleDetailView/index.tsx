import React from 'react';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import viewStyles from './ScheduleDetailView.module.scss';
import { ScheduleDetailViewHeader } from './ScheduleDetailViewHeader';
import { EventForm } from './EventForm';
import { EventComments } from './EventComments';

interface IScheduleDetailView {
  className?: string;
}

export const ScheduleDetailView: React.FC<IScheduleDetailView> = React.memo((props) => {
  const formMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isReadOnly = formMode === NSchedule.FormModes.VIEW,
    classes = React.useMemo(
      () =>
        [viewStyles.ScheduleDetailView, isReadOnly && viewStyles.viewMode, props.className].filter(Boolean).join(' '),
      [props.className, isReadOnly],
    ),
    [isSubmitting, setSubmitting] = React.useState<null | boolean>(null);

  return (
    <section className={classes}>
      <ScheduleDetailViewHeader isSubmitting={isSubmitting} />
      <EventForm setSubmitting={setSubmitting} />
      <EventComments />
    </section>
  );
});
