import viewStyles from './ScheduleDetailView.module.scss';

interface IScheduleDetailView {
  classes?: Array<string>;
}

export function ScheduleDetailView(props: IScheduleDetailView) {
  return (
    <section className={[viewStyles.ScheduleDetailView, props.classes].filter(Boolean).join(' ')}>
      <h2>Detail View</h2>
    </section>
  );
}
