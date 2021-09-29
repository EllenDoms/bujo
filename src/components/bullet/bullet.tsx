import React, { MouseEvent } from 'react';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

import { BulletStatusEnum, BulletTypeEnum } from '../../types/bullets';
import { ActionsMenu } from '../actionsMenu/actionsMenu';
import { IconButton } from '../button/button';

interface Props {
  status: BulletStatusEnum;
  type: BulletTypeEnum;
  children: string;
  onChangeBulletStatus: (status: BulletStatusEnum) => void;
  onEditBullet: () => void;
}

export function Bullet({ children, onChangeBulletStatus, onEditBullet, status, type }: Props) {
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

  const TypeIcon = Icons[ICON_TYPE_MAP[type] as keyof typeof Icons];
  const StatusIcon =
    ICON_STATUS_MAP[status] && Icons[ICON_STATUS_MAP[status] as keyof typeof Icons];

  return (
    <div
      className={cx(
        'flex flex-row gap-2 bg-gray-50 hover:bg-gray-100 rounded m-2 p-4 cursor-pointer items-center overflow-ellipsis',
        status !== BulletStatusEnum.OPEN && 'line-through',
        status === BulletStatusEnum.IRRELEVANT && 'opacity-40 italic',
      )}
      onClick={onEditBullet}
    >
      <div className={'w-4 h-4 flex-shrink-0'}>
        {StatusIcon !== '' && <StatusIcon className="w-4 h-4 text-rose-500" />}
      </div>

      <div className={'flex flex-row items-center flex-shrink-0'}>
        <TypeIcon className="h-4 w-4 text-rose-500" />
      </div>
      <div className="flex-grow text-sm overflow-clip">
        <p>{children}</p>
      </div>
      <div className="flex-shrink-0">
        {status === BulletStatusEnum.OPEN ? (
          <ActionsMenu options={bulletStatusOptions} />
        ) : (
          <IconButton icon="ReplyIcon" onClick={handleReOpen} />
        )}
      </div>
    </div>
  );
}

const ICON_TYPE_MAP = {
  [BulletTypeEnum.BIRTHDAY]: 'GiftIcon',
  [BulletTypeEnum.NOTE]: 'PencilAltIcon',
  [BulletTypeEnum.EVENT]: 'CalendarIcon',
  [BulletTypeEnum.TODO]: 'ClipboardIcon',
};

const ICON_STATUS_MAP = {
  [BulletStatusEnum.MIGRATED]: 'ArrowNarrowLeftIcon',
  [BulletStatusEnum.IRRELEVANT]: 'BanIcon',
  [BulletStatusEnum.DONE]: 'CheckIcon',
  [BulletStatusEnum.OPEN]: '',
};
