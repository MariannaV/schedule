import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { TIMEZONES } from 'configs/timezones';

interface IFieldTimezone extends SelectProps<string> {}

export function FieldTimezone(props: IFieldTimezone) {
  const options = React.useMemo(() => TIMEZONES.map((tz) => <Select.Option key={tz} value={tz} children={tz} />), []);
  return <Select placeholder="Please select a timezone" children={options} {...props} />;
}
