import React from 'react';
import { useRouter } from 'next/router';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';
import { PageLayout } from 'components';
import { ScheduleDetailView } from 'components/Schedule/ScheduleDetailView';
import pageEventStyles from 'components/Schedule/SchedulePage.module.scss';

const PageEventWrapper = () => (
  <ScheduleStore.provider>
    <PageEvent />
  </ScheduleStore.provider>
);

function PageEvent() {
  const { dispatch } = React.useContext(ScheduleStore.context),
    currentRoute = useRouter(),
    { eventId } = currentRoute.query as { eventId: string },
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId })),
    isLoading = !eventData || eventData?.loading;

  React.useEffect(
    function fetchData() {
      if (eventId) {
        ScheduleStore.API.detailViewModeChange(dispatch)({
          payload: {
            mode: NSchedule.FormModes.VIEW,
          },
        });

        ScheduleStore.API.detailViewSetOpened(dispatch)({
          payload: {
            openedId: eventId,
          },
        });

        fetchEventData();
      }

      async function fetchEventData() {
        try {
          await ScheduleStore.API.eventFetch(dispatch)({
            payload: {
              eventId,
            },
          });
        } catch (error) {
          currentRoute.push(`/course/schedule`);
        }
      }
    },
    [eventId],
  );

  return (
    <PageLayout
      title="Event"
      classes={pageEventStyles.pageEvent}
      githubId={'props.session.githubId'}
      loading={isLoading}
    >
      {!isLoading && <ScheduleDetailView />}
    </PageLayout>
  );
}

export default PageEventWrapper;
