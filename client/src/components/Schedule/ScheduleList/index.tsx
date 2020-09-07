import { ScheduleDetailView } from 'components/Schedule/ScheduleDetailView';
import { ScheduleList } from './List';
import wrapperStyles from './ScheduleListWrapper.module.css';

export function ScheduleListWrapper() {
  return (
    <main className={wrapperStyles.ScheduleListWrapper}>
      <ScheduleList classes={[wrapperStyles.ScheduleList]} />
      <ScheduleDetailView classes={[wrapperStyles.ScheduleView]} />
    </main>
  );
}
