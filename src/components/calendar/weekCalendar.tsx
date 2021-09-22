import { useMemo } from 'react';
import cx from 'clsx';
import { addDays, format, isEqual, startOfDay, startOfWeek } from 'date-fns';

import { onChangeWeek } from '../../hooks/useChangeWeek';
import { btnEnum } from '../../types/buttons';
import { DATE_FORMAT } from '../../types/dates';
import { IconButton } from '../button/button';

type Props = {
  setSelectedDate: (day: Date) => void;
  selectedDate: Date;
};

const WeekCalendar = ({ selectedDate, setSelectedDate }: Props) => {
  const today = startOfDay(new Date());

  const onDateClickHandle = (day: Date) => {
    setSelectedDate(day);
  };

  const days = useMemo(() => {
    const days: Date[] = [];
    let startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
    for (let i = 0; i < 7; i++) {
      days.push(addDays(startDate, i));
    }

    return days;
  }, [selectedDate]);

  const handleChangeweek = (action: btnEnum, date: Date) => {
    const newDate = onChangeWeek(action, date);
    newDate && setSelectedDate(newDate);
  };

  return (
    <div className="flex justify-center items-center ">
      <IconButton
        icon="ChevronLeftIcon"
        onClick={() => handleChangeweek(btnEnum.PREV, selectedDate)}
        withBg
      />
      <div className="mx-4 flex bg-gray-100 rounded p-2">
        {days.map((day: Date) => {
          const isSelected = isEqual(day, selectedDate);
          const isToday = isEqual(day, today);

          return (
            <div
              className={cx(
                'flex flex-col items-center mx-2 w-14 h-14 justify-center cursor-pointer rounded text-gray-500 hover:text-gray-700',
                isSelected && 'bg-white shadow-xl text-rose-600',
                !isSelected && isToday && 'bg-gray-200 text-gray-700 hover:text-gray-900',
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
      <IconButton
        icon="ChevronRightIcon"
        onClick={() => handleChangeweek(btnEnum.NEXT, selectedDate)}
        withBg
      />
    </div>
  );
};

export default WeekCalendar;
