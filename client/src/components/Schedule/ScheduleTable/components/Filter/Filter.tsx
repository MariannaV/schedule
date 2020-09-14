import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { Button, Checkbox } from 'antd';
import { CaretDownOutlined } from '@ant-design/icons';

import styles from './Filter.module.scss';

export function Filter({
  checkedColumns,
  setCheckedColumns,
  filterOptions,
}: {
  checkedColumns: string[];
  setCheckedColumns: Dispatch<SetStateAction<string[]>>;
  filterOptions: string[];
}) {
  const ref = useRef(null);
  const [isFilterOpened, setIsFilterOpened] = useState(false);

  const toggleFilter = () => {
    if (isFilterOpened) {
      setIsFilterOpened(false);
      document.removeEventListener('click', handleClickOutsideFilter);
    } else {
      setIsFilterOpened(true);
      document.addEventListener('click', handleClickOutsideFilter);
    }
  };

  const handleClickOutsideFilter = (event) => {
    if (ref.current && ref.current.contains(event.target)) {
      setIsFilterOpened(false);
      document.removeEventListener('click', handleClickOutsideFilter);
    }
  };

  return (
    <div className={styles.filterWrapper} ref={ref}>
      <div className={styles.filterTitle} onClick={toggleFilter}>
        <span className={styles.filterText}>Select visible columns</span>
        <CaretDownOutlined className={styles.icon} />
      </div>
      {isFilterOpened && (
        <div className={styles.filter}>
          <Checkbox.Group
            className={styles.checkbox}
            options={filterOptions}
            value={checkedColumns}
            onChange={(checkedValues) => setCheckedColumns(checkedValues)}
          />
          <Button type={'primary'} size={'small'} onClick={toggleFilter}>
            OK
          </Button>
        </div>
      )}
    </div>
  );
}
