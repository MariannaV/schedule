import axios from 'axios';

export interface Event {
  id: 'string';
  name: 'string';
  description: 'string';
  descriptionUrl: 'string';
  type: 'string';
  timeZon: 'string';
  dateTime: 'string';
  place: 'string';
  comment: 'string';
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
    const result = await axios.get<{ data: Event[] }>(`${this.baseUrl}/event/${eventId}`);
    return result.data.data;
  }

  async updateEvent(eventId: number, data: Partial<Event>) {
    const result = await axios.put<{ data: Event }>(`${this.baseUrl}/event/${eventId}`, data);
    return result.data.data;
  }

  async createEvent(data: Partial<Event>) {
    const result = await axios.post<{ data: Event }>(`${this.baseUrl}/event/`, data);
    return result.data.data;
  }

  async deleteEvent(eventId: number) {
    const result = await axios.delete<{ data: Event }>(`${this.baseUrl}/event/${eventId}`);
    return result.data.data;
  }
}
