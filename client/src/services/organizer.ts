import axios from 'axios';

export interface Organizer {
  id: 'string';
  name: 'string';
}

export class OrganizerService {
  private baseUrl: string;
  private teamId: number;

  constructor() {
    this.teamId = 42;
    this.baseUrl = `https://rs-react-schedule.firebaseapp.com/api/team/${this.teamId}`;
  }

  async getOrganizers() {
    const result = await axios.get<{ data: Organizer[] }>(`${this.baseUrl}/organizers`);
    return result.data.data;
  }

  async getOrganizer(organizerId: string) {
    const result = await axios.get<{ data: Organizer[] }>(`${this.baseUrl}/organizer/${organizerId}`);
    return result.data.data;
  }

  async updateOrganizer(organizerId: string, data: Partial<Organizer>) {
    const result = await axios.put<{ data: Organizer }>(`${this.baseUrl}/organizer/${organizerId}`, data);
    return result.data.data;
  }

  async createOrganizer(data: Partial<Organizer>) {
    const result = await axios.post<{ data: Organizer }>(`${this.baseUrl}/organizer/`, data);
    return result.data.data;
  }

  async deleteOrganizer(organizerId: string) {
    const result = await axios.delete<{ data: Organizer }>(`${this.baseUrl}/event/${organizerId}`);
    return result.data.data;
  }
}
