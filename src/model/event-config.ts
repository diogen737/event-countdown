import { Dayjs } from 'dayjs';
import produce, { immerable } from 'immer';

import { EventBackground } from '@/model/event-background';
import styles from '@/styles/Home.module.css';

export const EVENT_COLORS = {
  Red: 'red',
  Green: 'green',
  Blue: 'blue',
  Yellow: 'yellow',
} as const;

export const EVENT_TYPES = {
  Christmas: 'christmas',
  NewYear: 'new-year',
  Meeting: 'meeting',
  Misc: 'misc',
} as const;

export const EVENT_BACKGROUNDS = {
  regular: {
    url: '/wall.webp',
    class: '',
  },
  new_year: {
    url: '/wall-ny.webp',
    class: styles.blurred,
  },
} as const;

export type EventColor = typeof EVENT_COLORS[keyof typeof EVENT_COLORS];
export type EventType = keyof typeof EVENT_TYPES;

export class EventConfig {
  [immerable] = true;

  public background: EventBackground;

  constructor(
    public name: string,
    public date: Dayjs,
    public type?: EventType,
    public color: EventColor = 'red'
  ) {
    if (!this.type) {
      // determine type base on the date if not overridden
      this.type = this.getType(this.date);
    }
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
    }).setType(this.getType(v));
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

  private getType(date: Dayjs): EventType {
    if ([0, 11].includes(date.month())) {
      return 'NewYear';
    }
    return 'Misc';
  }

  private getBackground(type: EventType): EventBackground {
    switch (type) {
      case 'Christmas':
      case 'NewYear':
        return EVENT_BACKGROUNDS.new_year;
      default:
        return EVENT_BACKGROUNDS.regular;
    }
  }
}
