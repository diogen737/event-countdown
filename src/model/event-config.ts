import { Dayjs } from 'dayjs';
import produce, { immerable } from 'immer';

import { EventBackground } from '@/model/event-background';
import styles from '@/styles/Home.module.css';

export const EVENT_COLORS = ['red', 'green', 'blue', 'yellow'] as const;

export const EVENT_TYPES = {
  christmas: 'Christmas',
  meeting: 'Meeting',
  misc: 'Other',
} as const;

export const EVENT_BACKGROUNDS: { [type in EventType]?: EventBackground }= {
  Other: {
    url: '/wall.webp',
  },
  Christmas: {
    url: '/wall-christmas.webp',
    class: styles.blurred,
  },
  Meeting: {
    url: '/wall-meeting.webp',
    class: styles.blurred,
  }
} as const;

export type EventColor = typeof EVENT_COLORS[number];
export type EventType = typeof EVENT_TYPES[keyof typeof EVENT_TYPES];

export class EventConfig {
  [immerable] = true;

  public type: EventType;
  public background: EventBackground;

  constructor(
    public name: string,
    public date: Dayjs,
    type?: EventType,
    public color: EventColor = 'red'
  ) {
    // determine type base on the date if not overridden
    this.type = type || this.getType(this.date);
    this.background = this.getBackground(this.type);
  }

  /**
   * setters
   */

  public setName(v: string) {
    return produce(this, (draft) => {
      draft.name = v;
    });
  }

  public setColor(v: EventColor) {
    return produce(this, (draft) => {
      draft.color = v;
    });
  }

  public setDate(v: Dayjs) {
    return produce(this, (draft) => {
      draft.date = v;
    });
  }

  public setType(v: EventType) {
    return produce(this, (draft) => {
      draft.type = v;
      draft.background = this.getBackground(v);
    });
  }

  /**
   * getters
   */

  public get config(): Record<string, string> {
    return {
      name: this.name,
      date: this.date.toISOString(),
      type: this.type,
      color: this.color,
    };
  }

  public toJSON(): string {
    return JSON.stringify(this.config);
  }

  public toQuery(): string {
    return new URLSearchParams(this.config).toString();
  }

  public getType(date: Dayjs): EventType {
    if ([0, 11].includes(date.month())) {
      return EVENT_TYPES.christmas;
    }
    return EVENT_TYPES.misc;
  }

  private getBackground(type: EventType): EventBackground {
    return EVENT_BACKGROUNDS[type] ?? EVENT_BACKGROUNDS.Other!;
  }
}
