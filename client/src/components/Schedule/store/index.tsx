import React, { Dispatch } from 'react';
import { EventService } from 'services/event';
import { NSchedule } from './@types';
import { scheduleSelectors } from './selectors';
import { LocalStorage } from 'utils/localStorage';

export { NSchedule };

const storeKey = 'ScheduleStore';

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
    scheduleView: NSchedule.ScheduleView.table,
    isActiveDates: true,
  },
  //local storage works without Promise, so it gives some troubles
  ...JSON.parse(LocalStorage.getItem(storeKey) ?? '{}'),
};

function reducer(store: NSchedule.IStore, action: NSchedule.IActions) {
  switch (action.type) {
    case NSchedule.ActionTypes.USER_ROLE_CHANGE:
    case NSchedule.ActionTypes.USER_TIMEZONE_CHANGE:
    case NSchedule.ActionTypes.USER_SCHEDULE_VIEW_CHANGE:
    case NSchedule.ActionTypes.IS_ACTIVE_DATES_SET:
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

    case NSchedule.ActionTypes.EVENT_FETCH: {
      const { eventId } = action.payload;
      return {
        ...store,
        events: {
          ...store.events,
          map: {
            ...store.events.map,
            [eventId]: {
              ...store.events.map[eventId],
              loading: true,
            },
          },
        },
      };
    }

    case NSchedule.ActionTypes.EVENT_FETCH_SUCCESSFUL: {
      const { eventData } = action.payload;
      return {
        ...store,
        events: {
          ...store.events,
          map: {
            ...store.events.map,
            [eventData.id]: {
              ...eventData,
              loading: false,
            },
          },
        },
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

    case NSchedule.ActionTypes.EVENT_UPDATE: {
      return {
        ...store,
        events: {
          ...store.events,
          map: {
            ...store.events.map,
            [action.payload.eventData.id]: {
              ...store.events.map[action.payload.eventData.id],
              ...action.payload.eventData,
            },
          },
        },
      };
    }

    case NSchedule.ActionTypes.EVENT_DELETE: {
      const { [action.payload.eventId]: deletedEvent, ...newEventsMap } = store.events.map;
      return {
        ...store,
        events: {
          ...store.events,
          list: store.events.list.filter((eventId) => eventId !== action.payload.eventId),
          map: newEventsMap,
        },
      };
    }

    case NSchedule.ActionTypes.EVENT_COMMENT_CREATE: {
      return {
        ...store,
        events: {
          ...store.events,
          map: {
            ...store.events.map,
            [action.payload.eventData.id]: {
              ...store.events.map[action.payload.eventData.id],
              comments: [...store.events.map[action.payload.eventData.id].comments],
            },
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

const API_Schedule = {
  userRoleChange: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IUserRoleChange, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.USER_ROLE_CHANGE, ...params }),
  userTimeZoneChange: (dispatch: Dispatch<NSchedule.IActions>) => (
    params: Omit<NSchedule.IUserTimeZoneChange, 'type'>,
  ) => dispatch({ type: NSchedule.ActionTypes.USER_TIMEZONE_CHANGE, ...params }),
  userScheduleViewChange: (dispatch: Dispatch<NSchedule.IActions>) => (
    params: Omit<NSchedule.IUserScheduleViewChange, 'type'>,
  ) => dispatch({ type: NSchedule.ActionTypes.USER_SCHEDULE_VIEW_CHANGE, ...params }),
  eventsFetchStart: (dispatch: Dispatch<NSchedule.IActions>) => () =>
    dispatch({ type: NSchedule.ActionTypes.EVENTS_FETCH_START }),
  eventsSet: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IEventsSet, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.EVENTS_SET, ...params }),
  isActiveDatesSet: (dispatch: Dispatch<NSchedule.IActions>) => (params: Omit<NSchedule.IIsActiveDatesSet, 'type'>) =>
    dispatch({ type: NSchedule.ActionTypes.IS_ACTIVE_DATES_SET, ...params }),
  eventFetch: (dispatch: Dispatch<NSchedule.IActions>) => async (params: Omit<NSchedule.IEventFetch, 'type'>) => {
    try {
      const { eventId } = params.payload;

      dispatch({
        type: NSchedule.ActionTypes.EVENT_FETCH,
        payload: {
          eventId,
        },
      });

      dispatch({
        type: NSchedule.ActionTypes.EVENT_FETCH_SUCCESSFUL,
        payload: {
          eventData: await new EventService().getEvent(eventId),
        },
      });
    } catch (error) {
      console.error(error);
      throw Error('eventFetch went wrong');
    }
  },
  eventCreate: (dispatch: Dispatch<NSchedule.IActions>) => async (params: Omit<NSchedule.IEventCreate, 'type'>) => {
    try {
      const { eventData } = params.payload;
      const data = await new EventService().createEvent({
        ...eventData,
        comments: [],
      });
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
  eventUpdate: (dispatch: Dispatch<NSchedule.IActions>) => async (params: Omit<NSchedule.IEventUpdate, 'type'>) => {
    try {
      const { eventData, eventId } = params.payload;
      const data = await new EventService().updateEvent(eventId, eventData);
      eventData.id = data.id;
      dispatch({
        type: NSchedule.ActionTypes.EVENT_UPDATE,
        payload: { eventId, eventData },
      });
      return { eventData };
    } catch (error) {
      console.error(error);
      throw Error('eventUpdate went wrong');
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
  eventCommentCreate: (dispatch: Dispatch<NSchedule.IActions>) => async (
    params: Omit<NSchedule.IEventCommentCreate, 'type'>,
  ) => {
    try {
      const { eventData, eventId, comment } = params.payload;
      eventData.comments.push(comment);
      await new EventService().updateEvent(eventId, eventData);
      dispatch({
        type: NSchedule.ActionTypes.EVENT_COMMENT_CREATE,
        payload: { eventId, comment, eventData },
      });
      return { eventData };
    } catch (error) {
      console.error(error);
      throw Error('eventCommentCreate went wrong');
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

  React.useEffect(
    function LocalStorageSync() {
      const syncFields: Array<keyof NSchedule.IStore> = ['detailView', 'user'];
      LocalStorage.setItem(
        storeKey,
        JSON.stringify(syncFields.reduce((acc, currentPart) => ({ ...acc, [currentPart]: store[currentPart] }), {})),
      );
    },
    [store],
  );

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
