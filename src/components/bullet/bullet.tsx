import React, { ReactNode } from 'react';
import {
  ArrowNarrowLeftIcon,
  BanIcon,
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
  // onClick: () => void;
  onClickDone: () => void;
}

export function Bullet({ children, onClickDone, status, type }: Props) {
  return (
    <div
      className={cx(
        'flex flex-row gap-2 bg-gray-100 hover:bg-gray-200 rounded m-2 p-4 cursor-pointer',
        status === BulletStatusEnum.DONE && 'line-through',
        status === BulletStatusEnum.IRRELEVANT && 'line-through opacity-30 italic',
      )}
      onClick={onClickDone}
    >
      <div className="w-6 h-6">
        {status === BulletStatusEnum.MIGRATED && (
          <ArrowNarrowLeftIcon className="w-6 h-6 text-rose-500" />
        )}
        {status === BulletStatusEnum.IRRELEVANT && <BanIcon className="w-6 h-6 text-gray-500" />}
      </div>

      <div className={'flex flex-row items-center'}>
        {type === BulletTypeEnum.BIRTHDAY && <GiftIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.NOTE && <PencilAltIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.EVENT && <CalendarIcon className="h-4 w-4 text-rose-500" />}
        {type === BulletTypeEnum.TODO && <ClipboardIcon className="h-4 w-4 text-rose-500" />}
      </div>
      {children}
    </div>
  );
}
