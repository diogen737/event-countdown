import { Dispatch, SetStateAction } from 'react';
import { Dayjs } from 'dayjs';

export interface EventControl {
    eventName: string;
    eventDate: Dayjs;
    setEventName: Dispatch<SetStateAction<string>>;
    setEventDate: Dispatch<SetStateAction<Dayjs>>;
}
