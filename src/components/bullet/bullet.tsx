import React, { MouseEvent, ReactNode } from 'react';
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
import { IconButton } from '../button/button';

interface Props {
  status: BulletStatusEnum;
  type: BulletTypeEnum;
  children: ReactNode;
  onChangeBulletStatus: (status: BulletStatusEnum) => void;
}

export function Bullet({ children, onChangeBulletStatus, status, type }: Props) {
  const bulletStatusOptions = [
    {
      label: 'Mark done',
      onClick: () => onChangeBulletStatus(BulletStatusEnum.DONE),
      icon: 'CheckIcon' as keyof typeof Icons,
    },
    {
      label: 'Migrate',
      onClick: () => onChangeBulletStatus(BulletStatusEnum.MIGRATED),
      icon: 'ArrowNarrowLeftIcon' as keyof typeof Icons,
    },
    {
      label: 'Set irrelevant',
      onClick: () => onChangeBulletStatus(BulletStatusEnum.IRRELEVANT),
      icon: 'BanIcon' as keyof typeof Icons,
    },
  ];

  const handleReOpen = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onChangeBulletStatus(BulletStatusEnum.OPEN);
  };

  return (
    <div
      className={cx(
        'flex flex-row gap-2 bg-gray-50 hover:bg-gray-100 rounded m-2 p-4 cursor-pointer items-center',
        status === BulletStatusEnum.DONE && 'line-through',
        status === BulletStatusEnum.IRRELEVANT && 'line-through opacity-40 italic',
      )}
      onClick={() =>
        onChangeBulletStatus(
          status === BulletStatusEnum.DONE ? BulletStatusEnum.OPEN : BulletStatusEnum.DONE,
        )
      }
    >
      <div className={'w-6 h-6'}>
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
      {status === BulletStatusEnum.OPEN ? (
        <ActionsMenu options={bulletStatusOptions} />
      ) : (
        <IconButton icon="ReplyIcon" onClick={handleReOpen} />
      )}
    </div>
  );
}
