import React, { Dispatch } from 'react';
import { NSchedule } from './@types';

const initialState: NSchedule.IStore = {
  events: {
    list: [],
    map: {},
  },
  openedId: null,
  user: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: NSchedule.UserRoles.MENTOR,
    get isMentor() {
      return this.role === NSchedule.UserRoles.MENTOR;
    },
  },
};

function reducer(store: NSchedule.IStore, action: NSchedule.IActions) {
  switch (action.type) {
    case NSchedule.ActionTypes.USER_ROLE_CHANGE:
      return { ...store, user: { ...store.user, role: action.payload.role } };

    case NSchedule.ActionTypes.USER_TIMEZONE:
      return { ...store, user: { ...store.user, timeZone: action.payload.timeZone } };

    case NSchedule.ActionTypes.EVENTS_SET: {
      return {
        ...store,
        events: action.payload.events.reduce<NSchedule.IStore['events']>(
          (acc, currentEvent) => {
            acc.list.push(currentEvent.id);
            acc.map[currentEvent.id] = currentEvent;
            return acc;
          },
          { list: [], map: {} },
        ),
      };
    }

    default:
      return store;
  }
}

export const API_Schedule = {
  userRoleChange: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IUserRoleChange, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.USER_ROLE_CHANGE, ...params }),
  userTimeZoneChange: (dispatch: Dispatch<NSchedule.IActions>) => (
    params: Omit<NSchedule.IUserTimeZoneChange, 'type'>,
  ) => dispatch({ type: NSchedule.ActionTypes.USER_TIMEZONE, ...params }),
  eventsSet: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IEventsSet, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.EVENTS_SET, ...params }),
};

const storeContext = React.createContext<NSchedule.IStoreContext>(null!);

const StoreProvider: React.FC = (props) => {
  // @ts-ignore
  const [store, dispatch] = React.useReducer(reducer, initialState),
    contextValue = React.useMemo(() => ({ store, dispatch }), [store]);
  return <storeContext.Provider value={contextValue} children={props.children} />;
};

export const ScheduleStore = {
  provider: StoreProvider,
  context: storeContext,
};
