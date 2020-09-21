import axios from 'axios';

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
  checker: string;
  'online/offline': string;
  organizers: string[];
  comments: string[];
}

export enum eventTypes {
  codejam = 'Code jam',
  codewars = 'Codewars',
  course = 'Course',
  interview = 'Interview',
  lecture = 'Lecture',
  meetup = 'Meetup',
  'self-education' = 'Self-education',
  task = 'Task',
  test = 'Test',
  video = 'Video',
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

const hooks = {};

export const API_Events = {
  EventService,
  hooks,
};
