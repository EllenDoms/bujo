import { useMemo, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import cx from 'clsx';
import { addDays, addWeeks, format, isEqual, startOfDay, startOfWeek, subWeeks } from 'date-fns';

import { DATE_FORMAT } from '../../types/dates';

type Props = {
  showDetailsHandle: (day: Date) => void;
};

enum btnEnum {
  PREV = 'PREV',
  NEXT = 'NEXT',
}

const WeekCalendar = ({ showDetailsHandle }: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));

  const onDateClickHandle = (day: Date) => {
    setSelectedDate(day);
    showDetailsHandle(day);
  };

  const onChangeWeek = (btnAction: btnEnum) => {
    if (btnAction === btnEnum.PREV) {
      setSelectedDate(subWeeks(selectedDate, 1));
    } else if (btnAction === btnEnum.NEXT) {
      setSelectedDate(addWeeks(selectedDate, 1));
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
    <div className="flex justify-center items-center">
      <ChevronLeftIcon
        className="h-5 w-5 text-blue-500"
        onClick={() => onChangeWeek(btnEnum.PREV)}
      />
      <div className="mx-4 flex">
        {days.map((day: Date) => {
          const isSelected = isEqual(day, selectedDate);

          return (
            <div
              className={cx(
                'flex flex-col items-center mx-2 w-14 h-14 justify-center cursor-pointer rounded-full text-gray-500',
                isSelected && 'bg-rose-100 text-rose-600',
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
      <ChevronRightIcon
        className="h-5 w-5 text-blue-500"
        onClick={() => onChangeWeek(btnEnum.NEXT)}
      />
    </div>
  );
};

export default WeekCalendar;
