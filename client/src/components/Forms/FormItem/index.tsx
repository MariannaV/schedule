import React from 'react';
import { Form } from 'antd';
import moment from 'moment';
import { FormItemProps } from 'antd/lib/form';
import formItemStyles from './FormItem.module.scss';

interface IFormItem extends FormItemProps {
  isReadOnly?: boolean;
  type: 'input' | 'select' | 'time';
  name: string;
}

export const FormItem: React.FC<IFormItem> = React.memo((props) => {
  const { isReadOnly = false, className, type, ...formItemProps } = props,
    classes = React.useMemo(
      () => [formItemStyles.field, isReadOnly && 'isReadOnly', className].filter(Boolean).join(' '),
      [className, isReadOnly],
    );

  return (
    <Form.Item
      {...formItemProps}
      className={classes}
      children={isReadOnly ? <FieldView type={type} /> : props.children}
    />
  );
});

interface IFieldView {
  type: IFormItem['type'];
  value?: string;
}

function FieldView(props: IFieldView) {
  const { type, value } = props,
    ref = React.useRef(null),
    fieldValue = React.useMemo(() => {
      switch (type) {
        case 'time':
          return moment(value).format('LT');

        default:
          return value;
      }
    }, [value, type]);

  React.useEffect(function hideEmptyField() {
    const formItemNode = (ref.current as any).closest('.ant-form-item');
    if (!fieldValue) formItemNode.classList.add('isEmpty');
    return () => formItemNode.classList.remove('isEmpty');
  }, []);

  return <p children={fieldValue} ref={ref} />;
}
