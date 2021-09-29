import React from 'react';

import { BulletStatusEnum, IBulletWithStatus } from '../../types/bullets';

import { Bullet } from './bullet';

interface Props {
  bulletsWithStatus: IBulletWithStatus[];
  date: Date;
  onChangeBulletStatus: (newStatus: BulletStatusEnum, bulletStatus: IBulletWithStatus) => void;
}

export function BulletList({ bulletsWithStatus, date, onChangeBulletStatus }: Props) {
  return (
    <div className="w-full max-w-md h-full">
      {bulletsWithStatus && (
        <div className="flex flex-col justify-items-start">
          {bulletsWithStatus.map((bulletStatus) => (
            <Bullet
              key={bulletStatus.id}
              onChangeBulletStatus={(newStatus) => onChangeBulletStatus(newStatus, bulletStatus)}
              status={bulletStatus.status}
              type={bulletStatus.data.type}
            >
              {bulletStatus.data.title}
            </Bullet>
          ))}
        </div>
      )}
    </div>
  );
}
