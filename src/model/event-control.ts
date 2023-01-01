import { Dispatch, SetStateAction } from 'react';
import { Dayjs } from 'dayjs';

import { EventColor } from '@/model/const/event-color';

export interface EventControl {
  eventName: string;
  eventDate: Dayjs;
  eventColor: EventColor;
  setEventName: Dispatch<SetStateAction<string>>;
  setEventDate: Dispatch<SetStateAction<Dayjs>>;
  setEventColor: Dispatch<SetStateAction<EventColor>>;
}
