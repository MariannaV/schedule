import React, { Component } from 'react';

export const ScheduleContext = React.createContext();

export class StateContext extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
      mentorMode: true,
      viewMode: 'table',
    };
  }

  render() {
    return (
      <ScheduleContext.Provider
        value={{
          view: this.state.viewMode,
          mentorMode: this.state.mentorMode,
          changeViewMode: this.changeViewMode,
          toggleMentorMode: this.toggleMentorMode,
        }}
      >
        {this.props.children}
      </ScheduleContext.Provider>
    );
  }

  changeViewMode = (value) => {
    console.log('Change view to ', value);
    this.setState({ viewMode: value });
  };

  toggleMentorMode = () => {
    console.log('changing mentor mode');
    this.setState({ mentorMode: !this.state.mentorMode });
  };
}
