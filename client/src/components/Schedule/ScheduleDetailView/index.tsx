import React from 'react';
import { Typography, Dropdown, Menu } from 'antd';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import viewStyles from './ScheduleDetailView.module.scss';
import { EventForm } from './EventForm';
import { EventComments } from './EventComments';

interface IScheduleDetailView {
  className?: string;
}

export const ScheduleDetailView: React.FC<IScheduleDetailView> = React.memo((props) => {
  const classes = React.useMemo(() => [viewStyles.ScheduleDetailView, props.className].filter(Boolean).join(' '), [
    props.className,
  ]);
  return (
    <section className={classes}>
      <ScheduleDetailViewHeader />
      <EventForm />
      <EventComments />
    </section>
  );
});

function ScheduleDetailViewHeader() {
  const openedItem = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    detailViewMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isCreateMode = detailViewMode === NSchedule.FormModes.CREATE,
    isViewMode = detailViewMode === NSchedule.FormModes.VIEW,
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    { dispatch } = React.useContext(ScheduleStore.context),
    onToggleViewMode = React.useCallback(
      () =>
        ScheduleStore.API.detailViewModeChange(dispatch)({
          payload: {
            mode: isViewMode ? NSchedule.FormModes.EDIT : NSchedule.FormModes.VIEW,
          },
        }),
      [isViewMode],
    ),
    onDelete = React.useCallback(async () => {
      await ScheduleStore.API.eventDelete(dispatch)({
        payload: {
          eventId: openedItem,
        },
      });
      ScheduleStore.API.detailViewSetOpened(dispatch)({
        payload: {
          openedId: null,
        },
      });
    }, [openedItem]),
    menu = React.useMemo(
      () => (
        <Menu>
          <Menu.Item children={isViewMode ? 'Edit' : 'View'} onClick={onToggleViewMode} />
          <Menu.Item children="Delete" onClick={onDelete} />
        </Menu>
      ),
      [isViewMode],
    );

  return (
    <header className={viewStyles.ScheduleDetailViewHeader}>
      <Typography.Title children="Event" data-id={openedItem ?? 'new'} level={3} />
      {!isCreateMode && isMentor && <Dropdown.Button overlay={menu} />}
    </header>
  );
}
