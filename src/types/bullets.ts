export enum BulletTypeEnum {
  TASK = 'TASK',
  BIRTHDAY = 'BIRTHDAY',
  EVENTS = 'EVENTS',
  NOTES = 'NOTES',
}

export interface Bullet {
  id: string;
  title: string;
  description?: string;
  type: BulletTypeEnum;
  created_at: Date;
  updated_at: Date;
  // ownerId: string
  // tag: string;
  // deadline?: Date
}

export enum BulletStatusEnum {
  TODO = 'TODO',
  DONE = 'DONE',
  MIGRATED = 'MIGRATED',
  IRRELEVANT = 'IRRELEVANT',
}

export interface BulletDate {
  date: Date;
  status: BulletStatusEnum;
}
