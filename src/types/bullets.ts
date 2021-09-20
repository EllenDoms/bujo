export enum BulletTypeEnum {
  TODO = 'todo',
  BIRTHDAY = 'birthday',
  EVENT = 'event',
  NOTE = 'note',
}

export interface IBullet {
  id: string;
  title: string;
  description?: string;
  type: BulletTypeEnum;
  created_at: Date;
  updated_at: Date;
}
export interface IBulletStatus {
  id: string;
  date: Date;
  status: BulletStatusEnum;
}

export interface IBulletWithStatus extends IBulletStatus {
  data: IBullet;
}

export enum BulletStatusEnum {
  OPEN = 'open',
  MIGRATED = 'migrated',
  IRRELEVANT = 'irrelevant',
  DONE = 'done',
}

export interface IBulletDate {
  date: Date;
  status: BulletStatusEnum;
}
