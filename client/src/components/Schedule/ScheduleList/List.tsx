import React from 'react';
import { Button, Typography } from 'antd';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import listStyles from './ScheduleList.module.scss';

interface IScheduleList {
  className?: string;
}

export function ScheduleList(props: IScheduleList) {
  return (
    <section className={[listStyles.ScheduleList, props.className].filter(Boolean).join(' ')}>
      <ScheduleListHeader />
    </section>
  );
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
