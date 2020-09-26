import React from 'react';
import { IComments, Comments } from 'components/Comments';
import { NSchedule, ScheduleStore } from 'components/Schedule/store';

function EventComments() {
  const { dispatch } = React.useContext(ScheduleStore.context),
    formMode = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewMode),
    isReadOnly = formMode === NSchedule.FormModes.VIEW;

  const eventId = ScheduleStore.useSelector(ScheduleStore.selectors.getDetailViewOpenedId),
    eventData = ScheduleStore.useSelector(ScheduleStore.selectors.getEvent({ eventId }));

  const isMentor = ScheduleStore.useSelector(ScheduleStore.selectors.getUserIsMentor),
    currentUser = isMentor ? 'Some mentor' : 'Some student';

  const onCommentCreate = React.useCallback(
    async (sendingComment: IComments.Comment) => {
      await ScheduleStore.API.eventCommentCreate(dispatch)({
        payload: {
          eventId,
          eventData,
          comment: {
            ...sendingComment,
            commentId: `${eventData.comments?.length}-${getRandomInt(1000)}`,
            author: currentUser,
          },
        },
      });
    },
    [eventId, eventData, currentUser],
  );

  if (!isReadOnly || !eventData?.commentsEnabled) return null;

  return (
    <span>
      <Comments.Widget onCommentCreate={onCommentCreate} comments={eventData.comments} />
    </span>
  );
}

export { EventComments };

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}
