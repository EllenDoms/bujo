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
  is_active: boolean;
  date: Date;
  status: BulletStatusEnum;
  bullet_id: string;
}

export interface WithBullet {
  data: IBullet;
}

export type IBulletWithStatus = Omit<IBulletStatus, 'bullet_id'> & WithBullet;

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
