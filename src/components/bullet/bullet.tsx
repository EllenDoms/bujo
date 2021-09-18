import React, { ReactNode } from 'react';
import {
  ArrowNarrowLeftIcon,
  CalendarIcon,
  ClipboardIcon,
  GiftIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';
import cx from 'clsx';

import { BulletStatusEnum, BulletTypeEnum } from '../../types/bullets';

interface Props {
  status: BulletStatusEnum;
  type: BulletTypeEnum;
  children: ReactNode;
}

export function Bullet({ children, status, type }: Props) {
  return (
    <div
      className={cx(
        'flex flex-row gap-1',
        status === BulletStatusEnum.IRRELEVANT && 'line-through',
      )}
    >
      <div className="w-6 h-6">
        {status === BulletStatusEnum.MIGRATED && <ArrowNarrowLeftIcon className="w-6 h-6" />}
      </div>

      <div
        className={cx(
          'flex flex-row items-center',
          status === BulletStatusEnum.DONE && 'line-through',
        )}
      >
        {type === BulletTypeEnum.BIRTHDAY && <GiftIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.NOTE && <PencilAltIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.EVENT && <CalendarIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.TODO && <ClipboardIcon className="h-4 w-4 text-rose-500" />}
      </div>
      {children}
    </div>
  );
}
