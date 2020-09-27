import React from 'react';
import { Modal } from 'antd';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import viewStyles from './ScheduleDetailView.module.scss';
import { ScheduleDetailViewHeader } from './ScheduleDetailViewHeader';
import { EventForm } from './EventForm';
import { EventComments } from './EventComments';

export interface IScheduleDetailViewModal {
  isVisible: null | boolean;
  changeVisibility: React.Dispatch<IScheduleDetailViewModal['isVisible']>;
}

export function ScheduleDetailViewModal(props: IScheduleDetailViewModal) {
  const { isVisible, changeVisibility } = props,
    onCancel = React.useCallback(() => changeVisibility(false), []);

  const formMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isReadOnly = formMode === NSchedule.FormModes.VIEW,
    classes = React.useMemo(
      () => [viewStyles.ScheduleDetailViewModal, isReadOnly && viewStyles.viewMode].filter(Boolean).join(' '),
      [isReadOnly],
    );

  const [isSubmitting, setSubmitting] = React.useState<null | boolean>(null);
  return (
    <Modal
      title={<ScheduleDetailViewHeader isSubmitting={isSubmitting} />}
      visible={!!isVisible}
      onCancel={onCancel}
      footer={null}
      className={classes}
    >
      <EventForm setSubmitting={setSubmitting} />
      <EventComments />
    </Modal>
  );
}
