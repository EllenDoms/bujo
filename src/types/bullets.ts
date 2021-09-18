export enum BulletTypeEnum {
  TODO = 'todo',
  BIRTHDAY = 'birthday',
  EVENT = 'event',
  NOTE = 'note',
}

export interface Bullet {
  id: string;
  title: string;
  description?: string;
  type: { title: BulletTypeEnum };
  created_at: Date;
  updated_at: Date;
  // owner_id: string
  // tag: string;
  // deadline?: Date
}

export interface BulletStatus {
  id: string;
  date: Date;
  description?: string;
  status: { title: BulletStatusEnum };
  data: Bullet;
}

export enum BulletStatusEnum {
  OPEN = 'open',
  MIGRATED = 'migrated',
  IRRELEVANT = 'irrelevant',
  DONE = 'done',
}

export interface BulletDate {
  date: Date;
  status: BulletStatusEnum;
}
