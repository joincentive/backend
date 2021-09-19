export type EntityOrString<Entity> = Entity | string

export type EntityOrStrings<Entity> = EntityOrString<Entity>[]

export const extractNum = (s: string) => parseInt(s.replace(/[^0-9\.]/g, ''), 10);
