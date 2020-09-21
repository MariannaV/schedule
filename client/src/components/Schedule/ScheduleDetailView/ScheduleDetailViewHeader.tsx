import React from 'react';
import { Typography, Dropdown, Menu, Button, Spin } from 'antd';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import viewStyles from './ScheduleDetailView.module.scss';
import { eventFormId } from './EventForm';
import formStyles from './ScheduleDetailView.module.scss';

export function ScheduleDetailViewHeader(props: { isSubmitting: null | boolean }) {
  const openedItem = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    detailViewMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isCreationMode = detailViewMode === NSchedule.FormModes.CREATE,
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
    [isDeleting, setIsDeleting] = React.useState<null | boolean>(null),
    onDelete = React.useCallback(async () => {
      try {
        setIsDeleting(true);
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
      } catch (error) {
        console.error(error);
      } finally {
        setIsDeleting(false);
      }
    }, [openedItem]),
    menu = React.useMemo(
      () => (
        <Menu>
          <Menu.Item children={isViewMode ? 'Edit' : 'View'} onClick={onToggleViewMode} />
          <Menu.Item onClick={onDelete}>
            Delete
            {isDeleting && <Spin />}
          </Menu.Item>
        </Menu>
      ),
      [isViewMode, isDeleting, onDelete, onToggleViewMode],
    );

  return (
    <header className={viewStyles.ScheduleDetailViewHeader}>
      <Typography.Title children="Event" data-id={openedItem ?? 'new'} level={3} />
      {!isCreationMode && isMentor && <Dropdown.Button overlay={menu} />}
      {!isViewMode && <ButtonSubmit isSubmitting={props.isSubmitting} />}
    </header>
  );
}

function ButtonSubmit(props: { isSubmitting: null | boolean }) {
  const detailViewMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isCreationMode = detailViewMode === NSchedule.FormModes.CREATE;

  return (
    <Button
      htmlType="submit"
      form={eventFormId}
      children={isCreationMode ? 'Create' : 'Update'}
      loading={!!props.isSubmitting}
      className={formStyles.EventFormSubmitButton}
    />
  );
}
