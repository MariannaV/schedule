import React from 'react';
import axios from 'axios';

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
    return result.data.data;
  }

  async deleteEvent(eventId: string) {
    const result = await axios.delete<{ data: Event }>(`${this.baseUrl}/event/${eventId}`);
    return result.data.data;
  }
}

const hooks = {
  useEventsData() {
    const [eventsData, setData] = React.useState<Event[]>([]),
      [eventsLoading, setLoading] = React.useState<null | boolean>(null);

    React.useEffect(() => {
      fetchEventsData();

      async function fetchEventsData() {
        setLoading(true);
        try {
          setData(await new EventService().getEvents());
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }, []);

    return React.useMemo(() => ({ eventsLoading, eventsData }), [eventsLoading, eventsData]);
  },
  useEventData(params: { eventId: Event['id'] }) {
    const { eventId } = params,
      [eventData, setData] = React.useState<null | Event>(null),
      [eventLoading, setLoading] = React.useState<null | boolean>(null);

    React.useEffect(() => {
      fetchEventsData();

      async function fetchEventsData() {
        setLoading(true);
        try {
          if (!eventId) return; //throw `${eventId} is incorrenct eventId`;
          setData(await new EventService().getEvent(eventId));
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      }
    }, [eventId]);

    return React.useMemo(() => ({ eventLoading, eventData }), [eventLoading, eventData]);
  },
};

export const API_Events = {
  EventService,
  hooks,
};
