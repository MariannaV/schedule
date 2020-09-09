import React, { useReducer } from 'react';

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

    default:
      return state;
  }
};

export const StateContext = (props) => {
  const [store, dispatch] = useReducer(reducer, initialState);

  const changeViewMode = (nextView) => {
    dispatch({ type: 'CHANGE_VIEW_MODE', nextView: nextView });
  };

  const toggleMentorMode = () => {
    dispatch({ type: 'TOGGLE_MENTOR_MODE' });
  };

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
