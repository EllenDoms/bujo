import React, { ChangeEvent } from 'react';
import cx from 'clsx';

interface Props {
  label: string;
  onBlur: (e: ChangeEvent) => void;
  handleChange: (e: ChangeEvent) => void;
  type: string;
  value: string;
  error?: string | false;
  isRequired?: boolean;
}

export function InputField({
  error,
  handleChange,
  isRequired = false,
  label,
  onBlur,
  type,
  value,
}: Props) {
  console.log(type);

  return (
    <div className="flex flex-col mb-4">
      <div className="flex justify-between">
        <label className="text-sm text-gray-700">
          {label} {isRequired && <span className="text-rose-500">*</span>}
        </label>
        <div className="h-4 text-rose-500 text-sm">{error}</div>
      </div>

      <input
        className={cx(
          'border border-gray-200 h-10 rounded bg-gray-50 p-4',
          error && 'border-rose-500',
        )}
        name={label}
        onBlur={onBlur}
        onChange={handleChange}
        type={type}
        value={value}
      />
    </div>
  );
}
