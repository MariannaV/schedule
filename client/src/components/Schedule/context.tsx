import React, { useReducer } from 'react';
import { useAsync } from 'react-use';
import { EventService } from '../../services/event';

export const ScheduleContext = React.createContext();

const initialState = {
  data: {},
  mentorMode: true,
  viewMode: 'table',
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MENTOR_MODE':
      return {
        ...state,
        mentorMode: !state.mentorMode,
      };

    case 'CHANGE_VIEW_MODE':
      return {
        ...state,
        viewMode: action.nextView,
      };

    case 'SET_DATA':
      return {
        ...state,
        data: action.setdata,
      };

    default:
      return state;
  }
};

export const StateContext = (props) => {
  const [store, dispatch] = useReducer(reducer, initialState);
  const eventService = new EventService();

  const changeViewMode = (nextView) => {
    dispatch({ type: 'CHANGE_VIEW_MODE', nextView: nextView });
  };

  const toggleMentorMode = () => {
    dispatch({ type: 'TOGGLE_MENTOR_MODE' });
  };

  useAsync(async () => {
    const data = await eventService.getEvents();
    dispatch({ type: 'SET_DATA', setdata: data });
  }, [EventService]);

  return (
    <ScheduleContext.Provider
      value={{
        view: store.viewMode,
        mentorMode: store.mentorMode,
        changeViewMode: changeViewMode,
        toggleMentorMode: toggleMentorMode,
      }}
    >
      {props.children}
    </ScheduleContext.Provider>
  );
};
