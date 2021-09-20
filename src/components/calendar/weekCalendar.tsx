import { useMemo } from 'react';
import cx from 'clsx';
import { addDays, addWeeks, format, isEqual, startOfWeek, subWeeks } from 'date-fns';

import { DATE_FORMAT } from '../../types/dates';
import { IconButton } from '../button/button';

type Props = {
  setSelectedDate: (day: Date) => void;
  selectedDate: Date;
};

enum btnEnum {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

const WeekCalendar = ({ selectedDate, setSelectedDate }: Props) => {
  const onDateClickHandle = (day: Date) => {
    setSelectedDate(day);
  };

  const onChangeWeek = (btnAction: btnEnum) => {
    if (btnAction === btnEnum.PREV) {
      const newDate = subWeeks(selectedDate, 1);
      setSelectedDate(newDate);
    } else if (btnAction === btnEnum.NEXT) {
      const newDate = addWeeks(selectedDate, 1);
      setSelectedDate(newDate);
    }
  };

  const days = useMemo(() => {
    const days: Date[] = [];
    let startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  }, [selectedDate]);

  return (
    <div className="flex justify-center items-center ">
      <IconButton icon="ChevronLeftIcon" onClick={() => onChangeWeek(btnEnum.PREV)} withBg />
      <div className="mx-4 flex bg-gray-100 rounded p-2">
        {days.map((day: Date) => {
          const isSelected = isEqual(day, selectedDate);

          return (
            <div
              className={cx(
                'flex flex-col items-center mx-2 w-14 h-14 justify-center cursor-pointer rounded text-gray-500',
                isSelected && 'bg-white shadow-xl text-rose-600',
              )}
              key={day.toString()}
              onClick={() => onDateClickHandle(day)}
            >
              <p className="text-xs leading-snug">{format(day, DATE_FORMAT.WEEK_DAY)}</p>
              <p className="text-lg leading-snug font-bold">{format(day, DATE_FORMAT.DAY)}</p>
            </div>
          );
        })}
      </div>
      <IconButton icon="ChevronRightIcon" onClick={() => onChangeWeek(btnEnum.NEXT)} withBg />
    </div>
  );
};

export default WeekCalendar;
