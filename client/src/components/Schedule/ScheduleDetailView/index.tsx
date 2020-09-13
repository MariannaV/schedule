import React from 'react';
import { Typography, Dropdown, Menu } from 'antd';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
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
      <ScheduleDetailViewHeader />
      <EventForm formData={eventData} eventId={openedItem} />
    </section>
  );
});

function ScheduleDetailViewHeader() {
  const openedItem = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    detailViewMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    { dispatch } = React.useContext(ScheduleStore.context),
    onToggleViewMode = React.useCallback(
      () =>
        ScheduleStore.API.detailViewModeChange(dispatch)({
          payload: {
            mode: detailViewMode === NSchedule.FormModes.VIEW ? NSchedule.FormModes.EDIT : NSchedule.FormModes.VIEW,
          },
        }),
      [detailViewMode],
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
          <Menu.Item
            children={detailViewMode === NSchedule.FormModes.VIEW ? 'Edit' : 'View'}
            onClick={onToggleViewMode}
          />
          <Menu.Item children="Delete" onClick={onDelete} />
        </Menu>
      ),
      [detailViewMode],
    );

  return (
    <header className={viewStyles.ScheduleDetailViewHeader}>
      <Typography.Title children="Event" data-id={openedItem ?? 'new'} level={3} />
      {isMentor && <Dropdown.Button overlay={menu} />}
    </header>
  );
}
