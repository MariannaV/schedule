import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { API_Events, Event, eventTypes } from 'services/event';
import { FieldTimezone } from 'components/Forms/fields';
import formStyles from './ScheduleDetailView.module.scss';

interface IEventForm {
  eventId?: Event['id'];
  formData?: Event;
}

function EventForm(props: IEventForm) {
  const { eventId } = props,
    onSubmit = React.useCallback(
      async (sendingData) => {
        const isCreating = Boolean(eventId);

        if (isCreating) {
          await new API_Events.EventService().createEvent(sendingData);
        } else {
          await new API_Events.EventService().updateEvent(eventId!, sendingData);
        }

        /*route.replace({
          ...prev,
            eventId,
            step: 'VIEW',
          },
        })*/
      },
      [eventId],
    );

  return (
    <Form
      name="eventForm"
      initialValues={props.formData}
      className={formStyles.EventForm}
      layout="vertical"
      requiredMark="optional"
      onFinish={onSubmit}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: 'Please input event name!' }]}
        children={<Input />}
      />
      <Form.Item
        label="Event type"
        name="type"
        rules={[{ required: true, message: 'Please select event type!' }]}
        children={
          <Select
            children={Object.entries({ ...eventTypes }).map(([key, value]) => (
              <Select.Option value={key} children={value} key={key} />
            ))}
          />
        }
      />
      <Form.Item
        label="Description"
        name="description"
        rules={[{ required: true, message: 'Please input event description!' }]}
        children={<Input />}
      />
      <Form.Item label="Link with description" name="descriptionUrl" children={<Input />} />

      <Input.Group compact>
        <Form.Item
          label="Timezone"
          name="timeZone"
          rules={[{ required: true, message: 'Please select event timeZone!' }]}
          children={<FieldTimezone style={{ width: 200 }} />}
        />
        <Form.Item
          label="Time"
          name="dateTime"
          rules={[{ required: true, message: 'Please select event time!' }]}
          children={<Input />}
        />
      </Input.Group>

      <Form.Item label="Place" name="place" children={<Input />} />

      <Form.Item label="Comment" name="comment" children={<Input />} />

      <Button htmlType="submit" children="Create" />
    </Form>
  );
}

export { EventForm };
