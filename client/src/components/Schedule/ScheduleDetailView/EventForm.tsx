import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { API_Events, Event, eventTypes } from 'services/event';
import { FieldTimezone } from 'components/Forms/fields';
import { FormItem } from 'components/Forms/FormItem';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import formStyles from './ScheduleDetailView.module.scss';

function EventForm() {
  const eventId = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const { dispatch } = React.useContext(ScheduleStore.context),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    formMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isCreation = formMode === NSchedule.FormModes.CREATE,
    isReadOnly = formMode === NSchedule.FormModes.VIEW;

  const [form] = Form.useForm(),
    [isSubmitting, setSubmitting] = React.useState<null | boolean>(null),
    onSubmit = React.useCallback(
      async (sendingData: Event) => {
        try {
          setSubmitting(true);
          if (isCreation) {
            const { eventData } = await ScheduleStore.API.eventCreate(dispatch)({
              payload: {
                eventData: sendingData,
              },
            });
            ScheduleStore.API.detailViewSetOpened(dispatch)({
              payload: {
                openedId: eventData.id,
              },
            });
          } else {
            await ScheduleStore.API.eventUpdate(dispatch)({
              payload: {
                eventId,
                eventData: sendingData,
              },
            });
          }
          ScheduleStore.API.detailViewModeChange(dispatch)({
            payload: {
              mode: NSchedule.FormModes.VIEW,
            },
          });
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      },
      [eventId, isCreation],
    );

  React.useEffect(
    function formReOpening() {
      if (eventId) {
        form.resetFields();
        form.setFieldsValue(eventData);
      }
    },
    [eventId],
  );

  React.useEffect(
    function formResetting() {
      if (formMode === NSchedule.FormModes.CREATE) form.resetFields();
    },
    [formMode],
  );

  React.useEffect(
    function checkPermissions() {
      if (!isMentor)
        ScheduleStore.API.detailViewModeChange(dispatch)({
          payload: {
            mode: NSchedule.FormModes.VIEW,
          },
        });
    },
    [isMentor],
  );

  return (
    <Form
      name="eventForm"
      form={form}
      initialValues={eventData}
      className={formStyles.EventForm}
      layout="vertical"
      scrollToFirstError
      preserve
      requiredMark={!isReadOnly && 'optional'}
      onFinish={onSubmit}
    >
      <FormItem
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input event name!' }]}
        type="input"
        children={<Input />}
        isReadOnly={isReadOnly}
      />

      <FormItem
        label="Event type"
        name="type"
        rules={[{ required: true, message: 'Please select event type!' }]}
        type="select"
        children={
          <Select
            children={Object.entries({ ...eventTypes }).map(([key, value]) => (
              <Select.Option value={key} children={value} key={key} />
            ))}
          />
        }
        isReadOnly={isReadOnly}
      />
      <FormItem
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input event description!' }]}
        type="input"
        children={<Input />}
        isReadOnly={isReadOnly}
      />
      <FormItem
        label="Link with description"
        name="descriptionUrl"
        type="input"
        children={<Input />}
        isReadOnly={isReadOnly}
      />

      <Input.Group compact>
        <FormItem
          label="Timezone"
          name="timeZone"
          rules={[{ required: true, message: 'Please select event timeZone!' }]}
          type="input"
          children={<FieldTimezone style={{ width: 200 }} />}
          isReadOnly={isReadOnly}
        />
        <FormItem
          label="Time"
          name="dateTime"
          rules={[{ required: true, message: 'Please select event time!' }]}
          type="time"
          children={<Input />}
          isReadOnly={isReadOnly}
        />
      </Input.Group>

      <FormItem label="Place" name="place" type="input" children={<Input />} isReadOnly={isReadOnly} />

      <FormItem label="Comment" name="comment" type="input" children={<Input />} isReadOnly={isReadOnly} />

      {!isReadOnly && <Button htmlType="submit" children={isCreation ? 'Create' : 'Update'} loading={!!isSubmitting} />}
    </Form>
  );
}

export { EventForm };
