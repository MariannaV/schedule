import React from 'react';
import axios from 'axios';
import { ScheduleStore, API_Schedule } from 'components/Schedule/store';

export interface Event {
  id: string;
  name: string;
  description: string;
  descriptionUrl: string;
  type: eventTypes;
  timeZone: string;
  dateTime: string;
  place: string;
  comment: string;
}

export enum eventTypes {
  video = 'Video',
  course = 'Course',
  'self-education' = 'Self-education',
  task = 'Task',
}

export class EventService {
  private baseUrl: string;
  private teamId: number;

  constructor() {
    this.teamId = 42;
    this.baseUrl = `https://rs-react-schedule.firebaseapp.com/api/team/${this.teamId}`;
  }

  async getEvents() {
    const result = await axios.get<{ data: Event[] }>(`${this.baseUrl}/events`);
    return result.data.data;
  }

  async getEvent(eventId: string) {
    const result = await axios.get<Event>(`${this.baseUrl}/event/${eventId}`);
    return result.data;
  }

  async updateEvent(eventId: string, data: Partial<Event>) {
    const result = await axios.put<{ data: Event }>(`${this.baseUrl}/event/${eventId}`, data);
    return result.data.data;
  }

  async createEvent(data: Partial<Event>) {
    const result = await axios.post<{ data: Event }>(`${this.baseUrl}/event/`, data);
    return result.data;
  }

  async deleteEvent(eventId: string) {
    const result = await axios.delete<{ data: Event }>(`${this.baseUrl}/event/${eventId}`);
    return result.data.data;
  }
}

const hooks = {
  useEventsData() {
    const { store, dispatch } = React.useContext(ScheduleStore.context),
      eventsData = store.events,
      [eventsLoading, setLoading] = React.useState<null | boolean>(null);

    React.useEffect(() => {
      const isFirstFetching = !eventsData.list.length;
      if (isFirstFetching && !eventsLoading) fetchEventsData();

      async function fetchEventsData() {
        setLoading(true);
        try {
          const events = await new EventService().getEvents();
          API_Schedule.eventsSet(dispatch)({
            payload: {
              events,
            },
          });
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }, [eventsData, eventsLoading]);

    return React.useMemo(() => ({ eventsLoading, eventsData }), [eventsLoading, eventsData]);
  },
};

export const API_Events = {
  EventService,
  hooks,
};
