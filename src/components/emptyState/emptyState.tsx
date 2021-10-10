import React from 'react';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

interface Props {
  icon: keyof typeof Icons;
  variant?: Variants;
  title?: string;
  text?: string;
}

enum Variants {
  IMPORTANT = 'IMPORTANT',
  DIMMED = 'DIMMED',
}

const ICON_STYLE_MAP = {
  [Variants.IMPORTANT]: 'text-rose-700 bg-rose-200',
  [Variants.DIMMED]: 'text-gray-300 bg-gray-100',
};

export function EmptyState({ icon, variant = Variants.IMPORTANT, text, title }: Props) {
  const HeroIcon = Icons[icon];

  return (
    <div className="text-center flex flex-col items-center my-2">
      <div className={cx('w-8 h-8 p-2 mr-4 mb-4 rounded-full', ICON_STYLE_MAP[variant])}>
        <HeroIcon className="w-8 h-8" />
      </div>
      <h1 className="text-gray-700 ">{title}</h1>
      <p>{text}</p>
    </div>
  );
}

EmptyState.variants = Variants;
