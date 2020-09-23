import React from 'react';
import { Form, Input, Button } from 'antd';
import { FormItem } from 'components/Forms/FormItem';
import { IComments } from './@types';
import { CommentsContext } from './CommentsWidget';

function CommentItem(props: IComments.Item) {
  const { isReadOnly, comment } = props,
    { onCommentCreate } = React.useContext(CommentsContext),
    [form] = Form.useForm(),
    [isSubmitting, setSubmitting] = React.useState<null | boolean>(null),
    onSubmit = React.useCallback(
      async (values) => {
        try {
          setSubmitting(true);
          await onCommentCreate?.(values);
          form.resetFields();
        } catch (error) {
          console.error(error);
        } finally {
          setSubmitting(false);
        }
      },
      [onCommentCreate],
    );

  return (
    <Form
      form={form}
      initialValues={comment}
      layout="vertical"
      scrollToFirstError
      preserve
      requiredMark={!isReadOnly && 'optional'}
      onFinish={onSubmit}
    >
      <FormItem
        label="Comment"
        name="message"
        rules={[{ required: true, message: 'Please input your comment!' }]}
        type="input"
        children={<Input />}
        isReadOnly={isReadOnly}
      />

      {!isReadOnly && <Button htmlType="submit" children="Create" type="primary" loading={!!isSubmitting} />}
    </Form>
  );
}

export { CommentItem };
