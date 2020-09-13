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
  get getUserIsMentor() {
    return createSelector(this.getUser, (user) => user.role === NSchedule.UserRoles.MENTOR);
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
};
