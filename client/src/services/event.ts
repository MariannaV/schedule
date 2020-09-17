import React from 'react';
import axios from 'axios';
import { ScheduleStore, API_Schedule } from 'components/Schedule/store';
import { IComments } from 'components/Comments';

export interface Event {
  id: string;
  name: string;
  description: string;
  descriptionUrl: string;
  deadLine: string;
  type: eventTypes;
  timeZone: string;
  dateTime: string;
  place: string;
  commentsEnabled: boolean;
  comments: Array<IComments.Comment>;
}

export enum eventTypes {
  video = 'Video',
  course = 'Course',
  'self-education' = 'Self-education',
  task = 'Task',
}

export enum EventTypeColor {
  deadline = 'red',
  test = '#63ab91',
  jstask = 'green',
  htmltask = 'green',
  htmlcssacademy = 'green',
  externaltask = 'green',
  codewars = 'green',
  codejam = 'green',
  newtask = 'green',
  lecture = 'blue',
  lecture_online = 'blue',
  lecture_offline = 'blue',
  lecture_mixed = 'blue',
  lecture_self_study = 'blue',
  info = '#ff7b00',
  warmup = '#63ab91',
  meetup = '#bde04a',
  workshop = '#bde04a',
  interview = '#63ab91',
}

export const EventTypeToName: Record<string, string> = {
  lecture_online: 'online lecture',
  lecture_offline: 'offline lecture',
  lecture_mixed: 'mixed lecture',
  lecture_self_study: 'self study',
  warmup: 'warm-up',
  jstask: 'js task',
  kotlintask: 'kotlin task',
  objctask: 'objc task',
  htmltask: 'html task',
  codejam: 'code jam',
  externaltask: 'external task',
  htmlcssacademy: 'html/css academy',
  codewars: 'codewars',
  // TODO: Left hardcoded (codewars:stage1|codewars:stage2) configs only for backward compatibility. Delete them in the future.
  'codewars:stage1': 'codewars',
  'codewars:stage2': 'codewars',
};

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
    const result = await axios.put<Event>(`${this.baseUrl}/event/${eventId}`, data);
    return result.data;
  }

  async createEvent(data: Partial<Event>) {
    const result = await axios.post<Event>(`${this.baseUrl}/event/`, data);
    return result.data;
  }

  async deleteEvent(eventId: string) {
    const result = await axios.delete<Event>(`${this.baseUrl}/event/${eventId}`);
    return result.data;
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
