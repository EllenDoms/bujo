import React from 'react';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

import { FunctionalBgColors, FunctionalDarkBgColors, FunctionalType } from '../../types/colors';

interface Props {
  label: string;
  onClick: (e: any) => void;
  leadingIcon?: keyof typeof Icons;
  trailingIcon?: keyof typeof Icons;
  type?: FunctionalType;
  isDisabled?: boolean;
}

export function Button({
  label,
  leadingIcon,
  trailingIcon,
  type = FunctionalType.DEFAULT,
  onClick,
  isDisabled = false,
}: Props) {
  const bgColor = FunctionalBgColors[type];
  const bgColorDark = FunctionalDarkBgColors[type];

  return (
    <button
      className={cx(
        `justify-center px-4 leading-8 text-sm ${bgColor} text-white rounded-sm shadow-sm hover:${bgColorDark} focus:${bgColorDark} outline-none`,
        isDisabled && 'opacity-50',
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

interface IconProps {
  icon: keyof typeof Icons;
  onClick: () => void;
}

export function IconButton({ icon, onClick }: IconProps) {
  const HeroIcon = Icons[icon];

  return (
    <button className="w-6 h-6 items-center justify-center" onClick={onClick}>
      <HeroIcon className="w-4 h-4 text-gray-500" />
    </button>
  );
}
