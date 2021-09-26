import React from 'react';
import cx from 'clsx';

interface Props {
  total: number;
  selectedNumber: number;
}

enum dotStates {
  BEFORE = 'BEFORE',
  CURRENT = 'CURRENT',
  AFTER = 'AFTER',
}

export function DotCounter({ selectedNumber, total }: Props) {
  let dots = [];
  for (let i = 1; i <= total; i++) {
    const state =
      i < selectedNumber
        ? dotStates.BEFORE
        : i > selectedNumber
        ? dotStates.AFTER
        : dotStates.CURRENT;

    dots.push(<Dot key={i} number={i} state={state} />);
  }

  return <div className="flex flex-row gap-2 justify-center">{dots}</div>;
}

const dotStatesStyling = {
  [dotStates.BEFORE]: 'bg-gray-200 opacity-50',
  [dotStates.CURRENT]: 'bg-rose-500 text-white',
  [dotStates.AFTER]: 'bg-gray-200',
};

interface DotProps {
  number: number;
  state: dotStates;
}

function Dot({ number, state }: DotProps) {
  return (
    <div
      className={cx(
        'rounded-full w-6 h-6 justify-center items-center flex',
        dotStatesStyling[state],
      )}
    >
      {number}
    </div>
  );
}
