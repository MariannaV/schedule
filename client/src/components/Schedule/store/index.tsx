import React, { Dispatch } from 'react';
import { EventService } from 'services/event';
import { NSchedule } from './@types';
import { scheduleSelectors } from './selectors';

export { NSchedule };

const initialState: NSchedule.IStore = {
  events: {
    list: [],
    map: {},
    loading: null,
  },
  detailView: {
    mode: NSchedule.FormModes.CREATE,
    openedId: null,
  },
  user: {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    role: NSchedule.UserRoles.MENTOR,
  },
};

function reducer(store: NSchedule.IStore, action: NSchedule.IActions) {
  switch (action.type) {
    case NSchedule.ActionTypes.USER_ROLE_CHANGE:
    case NSchedule.ActionTypes.USER_TIMEZONE:
      return { ...store, user: { ...store.user, ...action.payload } };

    case NSchedule.ActionTypes.EVENTS_FETCH_START:
      return { ...store, events: { ...store.events, loading: true } };

    case NSchedule.ActionTypes.EVENTS_SET: {
      return {
        ...store,
        events: action.payload.events.reduce<NSchedule.IStore['events']>(
          (acc, currentEvent) => {
            acc.list.push(currentEvent.id);
            acc.map[currentEvent.id] = currentEvent;
            return acc;
          },
          { list: [], map: {}, loading: false },
        ),
      };
    }

    case NSchedule.ActionTypes.EVENT_CREATE: {
      return {
        ...store,
        events: {
          ...store.events,
          list: [...store.events.list, action.payload.eventData.id],
          map: {
            ...store.events.map,
            [action.payload.eventData.id]: action.payload.eventData,
          },
        },
      };
    }

    case NSchedule.ActionTypes.EVENT_DELETE: {
      return {
        ...store,
        events: {
          ...store.events,
          list: store.events.list.filter((eventId) => eventId !== action.payload.eventId),
          map: {
            ...store.events.map,
            [action.payload.eventId]: undefined,
          },
        },
      };
    }

    case NSchedule.ActionTypes.DETAIL_VIEW_MODE_CHANGE:
    case NSchedule.ActionTypes.DETAIL_VIEW_SET_OPENED:
      return { ...store, detailView: { ...store.detailView, ...action.payload } };

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
  eventsFetchStart: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IEventsFetchStart, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.EVENTS_FETCH_START, ...params }),
  eventsSet: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IEventsSet, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.EVENTS_SET, ...params }),
  eventCreate: (dispatch: Dispatch<NSchedule.IActions>) => async (params: Omit<NSchedule.IEventCreate, 'type'>) => {
    try {
      const { eventData } = params.payload;
      const { data } = await new EventService().createEvent(eventData);
      eventData.id = data.id;
      dispatch({
        type: NSchedule.ActionTypes.EVENT_CREATE,
        payload: {
          eventData,
        },
      });
      return { eventData };
    } catch (error) {
      console.error(error);
      throw Error('eventCreate went wrong');
    }
  },
  eventDelete: (dispatch: Dispatch<NSchedule.IActions>) => async (params: Omit<NSchedule.IEventDelete, 'type'>) => {
    try {
      await new EventService().deleteEvent(params.payload.eventId);
      dispatch({ type: NSchedule.ActionTypes.EVENT_DELETE, ...params });
    } catch (error) {
      console.error(error);
    }
  },
  detailViewModeChange: (dispatch: Dispatch<NSchedule.IActions>) => (
    params: Omit<NSchedule.IDetailViewModeChange, 'type'>,
  ) => dispatch({ type: NSchedule.ActionTypes.DETAIL_VIEW_MODE_CHANGE, ...params }),
  detailViewSetOpened: (dispatch: Dispatch<NSchedule.IActions>) => (
    params: Omit<NSchedule.IDetailViewSetOpened, 'type'>,
  ) => dispatch({ type: NSchedule.ActionTypes.DETAIL_VIEW_SET_OPENED, ...params }),
};

const storeContext = React.createContext<NSchedule.IStoreContext>(null!);

const StoreProvider: React.FC = (props) => {
  // @ts-ignore
  const [store, dispatch] = React.useReducer(reducer, initialState),
    contextValue = React.useMemo(() => ({ store, dispatch }), [store]);
  return <storeContext.Provider value={contextValue} children={props.children} />;
};

function useSelector(selector: any) {
  const { store } = React.useContext(ScheduleStore.context);
  return selector(store);
}

export const ScheduleStore = {
  provider: StoreProvider,
  context: storeContext,
  API: API_Schedule,
  selectors: scheduleSelectors,
  useSelector,
};