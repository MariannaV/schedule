import React from 'react';
import { Event } from 'services/event';

export namespace NSchedule {
  export interface IStore {
    events: {
      list: Array<Event['id']>;
      map: Record<Event['id'], Event>;
    };
    openedId: Event['id'] | null;
    user: {
      role: UserRoles;
      timeZone: string;
      isMentor: boolean;
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

  export type IActions = IUserRoleChange | IUserTimeZoneChange | IEventsSet;

  export enum ActionTypes {
    USER_ROLE_CHANGE,
    USER_TIMEZONE,
    EVENTS_SET,
  }

  export interface IUserRoleChange {
    type: ActionTypes.USER_ROLE_CHANGE;
    payload: {
      role: UserRoles;
    };
  }

  export interface IUserTimeZoneChange {
    type: ActionTypes.USER_TIMEZONE;
    payload: {
      timeZone: IStore['user']['timeZone'];
    };
  }

  export interface IEventsSet {
    type: ActionTypes.EVENTS_SET;
    payload: {
      events: Array<Event>;
    };
  }
}
