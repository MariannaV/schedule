import React from 'react';
import { Event } from 'services/event';

export namespace NSchedule {
  export interface IStore {
    events: {
      list: Array<Event['id']>;
      map: Record<Event['id'], Event>;
      loading: boolean | null;
    };
    detailView: {
      mode: FormModes;
      openedId: Event['id'] | null;
    };
    user: {
      role: UserRoles;
      timeZone: string;
      scheduleView: ScheduleView;
    };
  }

  export interface IStoreContext {
    store: IStore;
    dispatch: React.Dispatch<any>;
  }

  export enum UserRoles {
    MENTOR = 'MENTOR',
    STUDENT = 'STUDENT',
  }

  export enum ScheduleView {
    table = 'Table',
    list = 'List',
    calendar = 'Calendar',
  }

  export enum FormModes {
    CREATE,
    EDIT,
    VIEW,
  }

  export type IActions =
    | IUserRoleChange
    | IUserTimeZoneChange
    | IUserScheduleViewChange
    | IEventsFetchStart
    | IEventsSet
    | IEventCreate
    | IEventDelete
    | IDetailViewModeChange
    | IDetailViewSetOpened;

  export enum ActionTypes {
    USER_ROLE_CHANGE,
    USER_TIMEZONE_CHANGE,
    USER_SCHEDULE_VIEW_CHANGE,
    EVENTS_FETCH_START,
    EVENTS_SET,
    EVENT_CREATE,
    EVENT_DELETE,
    DETAIL_VIEW_MODE_CHANGE,
    DETAIL_VIEW_SET_OPENED,
  }

  export interface IUserRoleChange {
    type: ActionTypes.USER_ROLE_CHANGE;
    payload: {
      role: UserRoles;
    };
  }

  export interface IUserTimeZoneChange {
    type: ActionTypes.USER_TIMEZONE_CHANGE;
    payload: {
      timeZone: IStore['user']['timeZone'];
    };
  }

  export interface IUserScheduleViewChange {
    type: ActionTypes.USER_SCHEDULE_VIEW_CHANGE;
    payload: {
      scheduleView: IStore['user']['scheduleView'];
    };
  }

  export interface IEventsFetchStart {
    type: ActionTypes.EVENTS_FETCH_START;
  }

  export interface IEventsSet {
    type: ActionTypes.EVENTS_SET;
    payload: {
      events: Array<Event>;
    };
  }

  export interface IEventCreate {
    type: ActionTypes.EVENT_CREATE;
    payload: {
      eventData: Event;
    };
  }

  export interface IEventDelete {
    type: ActionTypes.EVENT_DELETE;
    payload: {
      eventId: Event['id'];
    };
  }

  export interface IDetailViewModeChange {
    type: ActionTypes.DETAIL_VIEW_MODE_CHANGE;
    payload: {
      mode: IStore['detailView']['mode'];
    };
  }

  export interface IDetailViewSetOpened {
    type: ActionTypes.DETAIL_VIEW_SET_OPENED;
    payload: {
      openedId: IStore['detailView']['openedId'];
    };
  }
}
