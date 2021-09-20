import React, { ReactNode } from 'react';
import {
  ArrowNarrowLeftIcon,
  BanIcon,
  CalendarIcon,
  ClipboardIcon,
  GiftIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

import { BulletStatusEnum, BulletTypeEnum } from '../../types/bullets';
import { ActionsMenu } from '../actionsMenu/actionsMenu';

interface Props {
  status: BulletStatusEnum;
  type: BulletTypeEnum;
  children: ReactNode;
  // onClick: () => void;
  onClickDone: () => void;
}

export function Bullet({ children, onClickDone, status, type }: Props) {
  const bulletStatusOptions = [
    {
      label: 'Set open',
      onClick: () => console.log('open'),
      icon: 'ReplyIcon' as keyof typeof Icons,
    },
    {
      label: 'Migrate',
      onClick: () => console.log('migrate'),
      icon: 'ArrowNarrowLeftIcon' as keyof typeof Icons,
    },
    {
      label: 'Set irrelevant',
      onClick: () => console.log('irrelevant'),
      icon: 'BanIcon' as keyof typeof Icons,
    },

    {
      label: 'Mark done',
      onClick: () => console.log('open'),
      icon: 'CheckIcon' as keyof typeof Icons,
    },
  ];

  return (
    <div
      className="flex flex-row gap-2 bg-gray-50 hover:bg-gray-100 rounded m-2 p-4 cursor-pointer items-center"
      onClick={onClickDone}
    >
      <div
        className={cx(
          'w-6 h-6',
          status === BulletStatusEnum.DONE && 'line-through',
          status === BulletStatusEnum.IRRELEVANT && 'line-through opacity-30 italic',
        )}
      >
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
      <div className="flex-grow">{children}</div>
      <ActionsMenu options={bulletStatusOptions} />
    </div>
  );
}
