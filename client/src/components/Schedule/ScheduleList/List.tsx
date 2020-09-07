import listStyles from './ScheduleList.module.css';

interface IScheduleList {
  classes?: Array<string>;
}

export function ScheduleList(props: IScheduleList) {
  return (
    <section className={[listStyles.ScheduleList, props.classes].filter(Boolean).join(' ')}>
      <h2>List View</h2>
    </section>
  );
}
