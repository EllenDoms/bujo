import React, { MouseEvent } from 'react';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

interface Props {
  label: string;
  countNumber?: number;
  onClick?: (e: any) => void;
  leadingIcon?: keyof typeof Icons;
  trailingIcon?: keyof typeof Icons;
  buttonType?: 'submit' | 'button';
  isDisabled?: boolean;
  variant?: Variants;
}

enum Variants {
  PRIMARY = 'PRIMARY',
  SECONDARY = 'SECONDARY',
  LINK = 'LINK',
}

const VARIANT_THEME_MAP = {
  [Variants.PRIMARY]:
    'text-white bg-rose-500 hover:bg-rose-600 focus:bg-rose-600 shadow-sm hover:shadow-md',
  [Variants.SECONDARY]:
    'bg-gray-50 hover:bg-gray-100 focus:bg-gray-100 text-gray-500 hover:text-gray-700',
  [Variants.LINK]: 'underline text-rose-500',
  ICON: 'hover:bg-gray-100 focus:bg-gray-100 ',
};

export function Button({
  label,
  countNumber,
  leadingIcon,
  trailingIcon,
  buttonType = 'button',
  onClick,
  isDisabled = false,
  variant = Variants.PRIMARY,
}: Props) {
  return (
    <button
      className={cx(
        `justify-center px-4 leading-10 text-sm rounded outline-none font-semibold`,
        VARIANT_THEME_MAP[variant],
        isDisabled && 'opacity-50',
      )}
      onClick={onClick}
      type={buttonType}
    >
      {countNumber && (
        <span className="w-4 leading-4 justify-center  rounded-full border border-white text-white mr-2 text-xs items-center inline-block font-normal">
          {countNumber}
        </span>
      )}
      {label}
    </button>
  );
}

interface IconProps {
  icon: keyof typeof Icons;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
  withBg?: boolean;
}

export function IconButton({ icon, onClick, withBg = false }: IconProps) {
  const HeroIcon = Icons[icon];

  return (
    <button
      className={cx(
        'w-8 h-8 rounded flex items-center justify-center',
        VARIANT_THEME_MAP.ICON,
        withBg && 'bg-gray-50',
      )}
      onClick={onClick}
    >
      <HeroIcon className={'w-4 h-4 text-gray-500 hover:text-gray-900'} />
    </button>
  );
}

Button.Variant = Variants;
