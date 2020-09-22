import React from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import axios from 'axios';

interface IOrganizer {
  id: string;
  name: string;
}

interface IFieldOrganizers extends SelectProps<string> {}

export function FieldOrganizers(props: IFieldOrganizers) {
  const [organizersData, setOrganizersData] = React.useState<null | Array<IOrganizer>>(null),
    options = React.useMemo(
      () =>
        organizersData?.map((organizer) => (
          <Select.Option key={organizer.id} value={organizer.name}>
            <div className="demo-option-label-item">{organizer.name}</div>
          </Select.Option>
        )),
      [organizersData],
    );

  React.useEffect(() => {
    const getOrganizersData = async () => {
      const { data: organizersData } = await axios.get<{ data: Array<IOrganizer> }>(
        `https://rs-react-schedule.firebaseapp.com/api/team/42/organizers`,
      );
      setOrganizersData(organizersData.data);
    };
    getOrganizersData();
  }, []);

  return <Select placeholder="Please select organizers" children={options} {...props} />;
}
