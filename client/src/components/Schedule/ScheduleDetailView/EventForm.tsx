import React from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { Tag, Form, Input, Select, Switch, Upload, Button, Radio, DatePicker, message } from 'antd';
import moment from 'moment';
import { Event, eventTypes } from 'services/event';
import { FieldTimezone } from 'components/Forms/fields';
import { FieldOrganizers } from 'components/Forms/fields/FieldOrganizers';
import { FormItem, IFormItem } from 'components/Forms/FormItem';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import formStyles from './ScheduleDetailView.module.scss';
import { tagColors } from '../constants';

const eventFormHelpers = {
  formatTo: (sendingData: any) => {
    return {
      ...sendingData,
      // @ts-ignore
      attachments: sendingData?.attachments?.fileList,
      [sendingData ? 'dateCreation' : 'dateUpdate']: moment(),
      ...(sendingData.dateStartEnd && {
        dateStart: sendingData.dateStartEnd[0],
        dateEnd: sendingData.dateStartEnd[1],
        dateStartEnd: undefined,
      }),
      ...(!sendingData.comments && { comments: [] }),
    };
  },
  formatFrom: (eventData: Event) => {
    return {
      ...eventData,
      dateStart: moment(eventData?.dateStart),
      ...(eventData?.dateEnd && {
        dateStart: undefined,
        dateEnd: undefined,
        dateStartEnd: [moment(eventData.dateStart), moment(eventData.dateEnd)],
      }),
    };
  },
};

export const eventFormId = `eventFormId`;

function EventForm(props: { setSubmitting: React.Dispatch<null | boolean> }) {
  const eventId = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const { dispatch } = React.useContext(ScheduleStore.context),
    isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    formMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isCreation = formMode === NSchedule.FormModes.CREATE,
    isReadOnly = formMode === NSchedule.FormModes.VIEW;

  const [form] = Form.useForm(),
    formInitialValues = React.useMemo(() => eventFormHelpers.formatFrom(eventData), [eventData]),
    [eventType, setEventType] = React.useState<eventTypes>(eventData?.type),
    [attachmentfiles, setAttachmentFiles] = React.useState(eventData?.attachments),
    onSubmit = React.useCallback(
      async (sendingData: Event) => {
        const newEventData = eventFormHelpers.formatTo({ ...sendingData, comments: eventData?.comments });
        try {
          props.setSubmitting(true);
          if (isCreation) {
            const { eventData } = await ScheduleStore.API.eventCreate(dispatch)({
              payload: {
                eventData: newEventData,
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
                eventData: newEventData,
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
          props.setSubmitting(false);
        }
      },
      [eventId, isCreation, eventData?.comments],
    );

  React.useEffect(
    function formResetting() {
      form.resetFields();
      setEventType(eventData?.type);
      if (eventData) form.setFieldsValue(eventFormHelpers.formatFrom(eventData));
    },
    [eventId, eventData, formMode],
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

  const fields = React.useMemo<Record<string, (props: Partial<IFormItem>) => React.ReactElement>>(
    () => ({
      description: ({ isReadOnly }) => (
        <FormItem
          label="Description"
          name="description"
          rules={[{ required: true, message: 'Please input event description!' }]}
          type="input"
          children={<Input />}
          isReadOnly={isReadOnly}
        />
      ),
      descriptionUrl: ({ isReadOnly }) => (
        <FormItem
          label="Link with description"
          name="descriptionUrl"
          type="input"
          children={<Input />}
          isReadOnly={isReadOnly}
          className={formStyles.fieldLink}
        />
      ),
      timeZone: ({ isReadOnly }) => (
        <FormItem
          label="Timezone"
          name="timeZone"
          rules={[{ required: true, message: 'Please select event timeZone!' }]}
          type="input"
          children={<FieldTimezone style={{ width: 200 }} />}
          isReadOnly={isReadOnly}
        />
      ),
      dateTime: ({ isReadOnly }) => (
        <FormItem
          label="Start time"
          style={{ color: 'green' }}
          name="dateStart"
          rules={[{ required: true, message: 'Please select event time!' }]}
          type="time"
          children={<DatePicker showTime />}
          isReadOnly={isReadOnly}
        />
      ),
      organizers: ({ isReadOnly }) => (
        <FormItem
          label={'Organizers'}
          type={'select'}
          name={'organizers'}
          isReadOnly={isReadOnly}
          children={<FieldOrganizers mode="multiple" style={{ width: '300px' }} />}
        />
      ),
      dateTimeRange: ({ isReadOnly }) => {
        return !isReadOnly ? (
          <FormItem
            label="Start and deadline time"
            name="dateStartEnd"
            rules={[{ required: true, message: 'Please select event time and deadline!' }]}
            type="time"
            children={<DatePicker.RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" />}
            isReadOnly={isReadOnly}
          />
        ) : (
          <>
            <FormItem
              label="Start time"
              style={{ color: 'green' }}
              name="dateStart"
              type="time"
              children={<DatePicker showTime />}
              isReadOnly={isReadOnly}
            />
            <FormItem
              label="Deadline time"
              style={{ color: 'red' }}
              name="dateEnd"
              type="time"
              children={<DatePicker showTime />}
              isReadOnly={isReadOnly}
            />
          </>
        );
      },
      place: ({ isReadOnly }) => (
        <FormItem label="Place" name="place" type="input" children={<Input />} isReadOnly={isReadOnly} />
      ),
      onlineOffline: ({ isReadOnly }) => (
        <FormItem
          label="Online or offline"
          name="online/offline"
          type="checkbox" //radio
          rules={[{ required: true }]}
          children={
            <Radio.Group>
              <Radio value="Offline" children="Offline" checked />
              <Radio value="Online" children="Online" />
            </Radio.Group>
          }
          isReadOnly={isReadOnly}
        />
      ),
    }),
    [],
  );

  const updateAttachmentFileList = (info) => {
    if (info.file.status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
    setAttachmentFiles(info.fileList);
  };

  return (
    <Form
      id={eventFormId}
      name="eventForm"
      form={form}
      initialValues={formInitialValues}
      className={formStyles.EventForm}
      layout="vertical"
      scrollToFirstError
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
        className={formStyles.fieldName}
      />
      <Tag color={tagColors[eventData.type.toLowerCase()]}>
        <FormItem
          style={{ color: `${tagColors[eventData.type.toLowerCase()]}` }}
          label="Event type"
          name="type"
          rules={[{ required: true, message: 'Please select event type!' }]}
          type="select"
          children={
            <Select
              onSelect={setEventType as any}
              children={Object.entries({ ...eventTypes }).map(([key, value]) => (
                <Select.Option value={value} children={value} key={key} />
              ))}
            />
          }
          isReadOnly={isReadOnly}
          className={formStyles.fieldType}
        />
      </Tag>

      {(() => {
        switch (eventType) {
          case eventTypes.codejam:
          case eventTypes.codewars:
          case eventTypes.task:
          case eventTypes.test:
            return (
              <>
                <fields.description isReadOnly={isReadOnly} />
                <fields.timeZone isReadOnly={isReadOnly} />
                <fields.dateTimeRange isReadOnly={isReadOnly} />
                <fields.descriptionUrl isReadOnly={isReadOnly} />
              </>
            );

          case eventTypes.course:
          case eventTypes.video:
            return (
              <>
                <fields.description isReadOnly={isReadOnly} />
                <fields.timeZone isReadOnly={isReadOnly} />
                <fields.dateTime isReadOnly={isReadOnly} />
                <fields.descriptionUrl isReadOnly={isReadOnly} />
                <fields.organizers isReadOnly={isReadOnly} />
              </>
            );

          case eventTypes['self-education']:
            return (
              <>
                <fields.description isReadOnly={isReadOnly} />
                <fields.timeZone isReadOnly={isReadOnly} />
                <fields.dateTime isReadOnly={isReadOnly} />
              </>
            );

          case eventTypes.interview:
            return (
              <>
                <fields.description isReadOnly={isReadOnly} />
                <fields.onlineOffline isReadOnly={isReadOnly} />
                <fields.place isReadOnly={isReadOnly} />
                <fields.timeZone isReadOnly={isReadOnly} />
                <fields.dateTimeRange isReadOnly={isReadOnly} />
                <fields.descriptionUrl isReadOnly={isReadOnly} />
              </>
            );

          case eventTypes.lecture:
          case eventTypes.meetup:
            return (
              <>
                <fields.description isReadOnly={isReadOnly} />
                <fields.onlineOffline isReadOnly={isReadOnly} />
                <fields.place isReadOnly={isReadOnly} />
                <fields.timeZone isReadOnly={isReadOnly} />
                <fields.dateTime isReadOnly={isReadOnly} />
                <fields.descriptionUrl isReadOnly={isReadOnly} />
                <fields.organizers isReadOnly={isReadOnly} />
              </>
            );
        }
      })()}

      <FormItem label="Attachments" name="attachments" type="files" isReadOnly={isReadOnly}>
        <Upload multiple={true} defaultFileList={attachmentfiles} onChange={updateAttachmentFileList}>
          <Button icon={<UploadOutlined />} children="Click to upload" />
        </Upload>
      </FormItem>

      {!isReadOnly && (
        <FormItem
          label="Feedback is allowed"
          name="commentsEnabled"
          type="switch"
          children={<Switch defaultChecked={eventData?.commentsEnabled} />}
          isReadOnly={isReadOnly}
          className={formStyles.fieldComment}
        />
      )}
    </Form>
  );
}

export { EventForm };
