export const Events = {
    playerReady: 'fx:playerReady',
    notify: 'fx:notify',
} as const;

export type EventName = (typeof Events[keyof typeof Events]);
