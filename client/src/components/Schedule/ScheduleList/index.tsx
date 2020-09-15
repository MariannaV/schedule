import React from 'react';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import { ScheduleDetailView } from 'components/Schedule/ScheduleDetailView';
import { ScheduleList } from './List';
import wrapperStyles from './ScheduleListWrapper.module.scss';

export function ScheduleListWrapper() {
  const initializationFinished = useDetailViewInit();

  return (
    <section className={wrapperStyles.ScheduleListWrapper}>
      <ScheduleList className={wrapperStyles.ScheduleList} />
      {initializationFinished && <ScheduleDetailView className={wrapperStyles.ScheduleView} />}
    </section>
  );
}

function useDetailViewInit() {
  const { dispatch } = React.useContext(ScheduleStore.context),
    eventsList = ScheduleStore.useSelector(ScheduleStore.selectors.getEventsList),
    openedItem = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    [isFinished, setFinished] = React.useState(!!openedItem);

  React.useEffect(() => {
    if (!openedItem && eventsList.length) {
      ScheduleStore.API.detailViewSetOpened(dispatch)({
        payload: {
          openedId: eventsList[0],
        },
      });
      ScheduleStore.API.detailViewModeChange(dispatch)({
        payload: {
          mode: NSchedule.FormModes.VIEW,
        },
      });
      setFinished(true);
    }
  }, []);

  return isFinished;
}
