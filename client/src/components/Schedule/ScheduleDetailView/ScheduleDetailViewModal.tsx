import React from 'react';
import { Modal } from 'antd';
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

  const [isSubmitting, setSubmitting] = React.useState<null | boolean>(null);
  return (
    <Modal
      title={<ScheduleDetailViewHeader isSubmitting={isSubmitting} />}
      visible={!!isVisible}
      onCancel={onCancel}
      footer={null}
      className={viewStyles.ScheduleDetailViewModal}
    >
      <EventForm setSubmitting={setSubmitting} />
      <EventComments />
    </Modal>
  );
}
