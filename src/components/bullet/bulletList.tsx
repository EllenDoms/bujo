import React from 'react';

import { BulletStatusEnum, IBullet, IBulletWithStatus } from '../../types/bullets';
import { EmptyState } from '../emptyState/emptyState';

import { Bullet } from './bullet';

interface Props {
  bulletsWithStatus: IBulletWithStatus[];
  date: Date;
  onChangeBulletStatus: (newStatus: BulletStatusEnum, bulletStatus: IBulletWithStatus) => void;
  onEditBullet: (bullet: IBullet) => void;
}

export function BulletList({ bulletsWithStatus, date, onChangeBulletStatus, onEditBullet }: Props) {
  return (
    <div className="w-full max-w-md h-full">
      {bulletsWithStatus?.length > 0 ? (
        <div className="flex flex-col justify-items-start">
          {bulletsWithStatus.map((bulletStatus) => (
            <Bullet
              key={bulletStatus.id}
              onChangeBulletStatus={(newStatus) => onChangeBulletStatus(newStatus, bulletStatus)}
              onEditBullet={() => onEditBullet(bulletStatus.data)}
              status={bulletStatus.status}
              type={bulletStatus.data.type}
            >
              {bulletStatus.data.title}
            </Bullet>
          ))}
        </div>
      ) : (
        <div className="mt-">
          <EmptyState icon="ClipboardCheckIcon" variant={EmptyState.variants.DIMMED} />
        </div>
      )}
    </div>
  );
}
