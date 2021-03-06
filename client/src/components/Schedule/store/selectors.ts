import { createSelector } from 'reselect';
import { Event } from 'services/event';
import { NSchedule } from './@types';

export const scheduleSelectors = {
  get getEvents() {
    return createSelector(
      (store: NSchedule.IStore) => store,
      (store) => store.events,
    );
  },
  get getEventsList() {
    return createSelector(this.getEvents, (events) => events.list);
  },
  get getEventsMap() {
    return createSelector(this.getEvents, (events) => events.map);
  },
  get getEventsLoading() {
    return createSelector(this.getEvents, (events) => events.loading);
  },
  getEvent({ eventId }: { eventId: Event['id'] }) {
    return createSelector(this.getEventsMap, (eventsMap) => eventsMap[eventId]);
  },
  get getUser() {
    return createSelector(
      (store: NSchedule.IStore) => store,
      (store) => store.user,
    );
  },
  get getUserPreferredTimezone() {
    return createSelector(this.getUser, (user) => user.timeZone);
  },
  get getUserRole() {
    return createSelector(this.getUser, (user) => user.role);
  },
  get getUserIsMentor() {
    return createSelector(this.getUserRole, (userRole) => userRole === NSchedule.UserRoles.MENTOR);
  },
  get getUserPreferredScheduleView() {
    return createSelector(this.getUser, (user) => user.scheduleView);
  },
  get getUserIsActiveDates() {
    return createSelector(this.getUser, (user) => user.isActiveDates);
  },
  get getDetailView() {
    return createSelector(
      (store: NSchedule.IStore) => store,
      (store) => store.detailView,
    );
  },
  get getDetailViewOpenedId() {
    return createSelector(this.getDetailView, (detailView) => detailView.openedId);
  },
  get getDetailViewMode() {
    return createSelector(this.getDetailView, (detailView) => detailView.mode);
  },
};
