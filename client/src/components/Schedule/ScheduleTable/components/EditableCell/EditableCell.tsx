import React from 'react';
import { FormItem, IFormItem } from 'components/Forms/FormItem';

const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  return (
    <td {...restProps}>
      {editing ? (
        <FormItem
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
          type="time"
        ></FormItem>
      ) : (
        children
      )}
    </td>
  );
};
