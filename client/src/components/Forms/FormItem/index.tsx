import React from 'react';
import { Form, Checkbox, Switch, Tag } from 'antd';
import moment from 'moment-timezone';
import { FormItemProps } from 'antd/lib/form';
import formItemStyles from './FormItem.module.scss';
import { MapView } from 'components/Schedule/ScheduleMap/map';

export interface IFormItem extends FormItemProps {
  isReadOnly?: boolean;
  type: 'input' | 'select' | 'time' | 'checkbox' | 'switch' | 'files' | 'map';
  name: string;
  style?: React.CSSProperties;
  viewProps?: Record<string, any>;
}

export const FormItem: React.FC<IFormItem> = React.memo((props) => {
  const { isReadOnly = false, className, type, viewProps, ...formItemProps } = props,
    classes = React.useMemo(
      () => [formItemStyles.field, isReadOnly && 'isReadOnly', className].filter(Boolean).join(' '),
      [className, isReadOnly],
    );

  return (
    <Form.Item
      {...formItemProps}
      className={classes}
      children={isReadOnly ? <FieldView type={type} viewProps={viewProps} /> : props.children}
    />
  );
});

interface IFieldView {
  type: IFormItem['type'];
  viewProps?: IFormItem['viewProps'];
  value?: any;
}

function FieldView(props: IFieldView) {
  const { type, value, viewProps } = props,
    ref = React.useRef(null),
    fieldValue = React.useMemo(() => {
      switch (type) {
        case 'time': {
          return moment(viewProps?.value ?? value)
            .tz(viewProps?.timeZone)
            .format('DD.MM.YYYY HH:mm');
        }

        case 'checkbox':
          return <Checkbox disabled checked={!!value} />;

        case 'switch':
          return <Switch disabled checked={!!value} />;

        case 'files': {
          const files = value?.fileList ?? value ?? Array.prototype;
          return files.map((file) => <Tag children={file.name} key={`attachment-${file.uid}`} />);
        }

        case 'map':
          return <MapView isReadOnly markers={value} />;

        default:
          return value;
      }
    }, [viewProps, value, type]);

  React.useEffect(function hideEmptyField() {
    const formItemNode = (ref.current as any).closest('.ant-form-item'),
      isEmptyField = !fieldValue || (Array.isArray(fieldValue) && !fieldValue.length);
    if (isEmptyField) formItemNode.classList.add('isEmpty');
    return () => formItemNode.classList.remove('isEmpty');
  }, []);

  return <p children={fieldValue} ref={ref} />;
}
