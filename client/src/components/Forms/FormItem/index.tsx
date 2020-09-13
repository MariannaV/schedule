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

  if (isReadOnly) return <Form.Item className={classes} {...formItemProps} children={<FieldView type={type} />} />;

  return <Form.Item {...formItemProps} className={classes} />;
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
    if (!fieldValue) (ref.current as any).closest('.ant-form-item').classList.add('isEmpty');
  }, []);

  return <p children={fieldValue} ref={ref} />;
}
