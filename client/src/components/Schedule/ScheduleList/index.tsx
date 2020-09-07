import React from 'react';
import { Spin } from 'antd';
import { useRouter } from 'next/router';
import { ScheduleDetailView } from 'components/Schedule/ScheduleDetailView';
import { API_Events } from 'services/event';
import { ScheduleList } from './List';
import wrapperStyles from './ScheduleListWrapper.module.scss';

export function ScheduleListWrapper() {
  const router = useRouter(),
    { eventsData, eventsLoading } = API_Events.hooks.useEventsData();

  React.useEffect(() => {
    if (!eventsData.length || Object.keys(router.query).length) return;

    const initState = {
      openedItem: eventsData[0].id,
      step: 'view',
    };

    router.replace(`${router.pathname}?${new URLSearchParams(initState as any)}`, router.pathname, {
      shallow: true,
    });
  }, [eventsLoading]);

  return (
    <Spin spinning={Boolean(eventsLoading)} wrapperClassName={wrapperStyles.ScheduleListWrapper}>
      <ScheduleList classes={[wrapperStyles.ScheduleList]} />
      {router.query.openedItem && (
        <ScheduleDetailView eventId={router.query.openedItem as string} classes={[wrapperStyles.ScheduleView]} />
      )}
    </Spin>
  );
}
