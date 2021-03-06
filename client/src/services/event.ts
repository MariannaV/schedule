import axios from 'axios';
import { UploadFile } from 'antd/lib/upload/interface';
import { IComments } from 'components/Comments';
import { IPlace } from 'components/Schedule/ScheduleMap/map';

export interface Event {
  id: string;
  name: string;
  description: string;
  descriptionUrl: string;
  type: eventTypes;
  timeZone: string;
  dateCreation: string;
  dateUpdate: string;
  dateStart: string;
  dateEnd: string;
  place: string;
  checker: string;
  'online/offline': string;
  places: Array<IPlace>;
  organizer: string;
  commentsEnabled: boolean;
  comments: Array<IComments.Comment>;
  attachments: Array<UploadFile>;
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

const hooks = {};

export const API_Events = {
  EventService,
  hooks,
};
