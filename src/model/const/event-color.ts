export const EVENT_COLORS = {
    Red: 'red',
    Green: 'green',
    Blue: 'blue',
    Yellow: 'yellow',
} as const;

export type EventColor = typeof EVENT_COLORS[keyof typeof EVENT_COLORS];