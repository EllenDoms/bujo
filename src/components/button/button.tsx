import React from 'react';
import * as Icons from '@heroicons/react/outline';
import cx from 'clsx';

interface Props {
  label: string;
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
  [Variants.SECONDARY]: 'bg-gray-100 hover:bg-gray-300 focus:bg-gray-300 text-gray-500',
  [Variants.LINK]: 'underline text-rose-500',
};

export function Button({
  label,
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
    <button
      className={cx(
        'w-10 h-10 rounded flex items-center justify-center',
        VARIANT_THEME_MAP.SECONDARY,
      )}
      onClick={onClick}
    >
      <HeroIcon className="w-4 h-4 text-gray-500" />
    </button>
  );
}

Button.Variant = Variants;
