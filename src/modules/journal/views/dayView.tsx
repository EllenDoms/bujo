import React, { useMemo, useState } from 'react';
import { format } from 'date-fns';

import WeekCalendar from '../../../components/calendar/weekCalendar';
import { Bullet } from '../../../types/bullets';
import { DATE_FORMAT } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const bulletData: Bullet[] | null = useMemo(() => {
    const bullets: Bullet[] = [];

    return bullets;
  }, [selectedDate]);

  return (
    <div className="flex flex-col items-center">
      <WeekCalendar showDetailsHandle={(day) => setSelectedDate(day)} />
      {selectedDate && <div>{format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}</div>}
      {bulletData && <div>{bulletData.map((bullet) => bullet.title)}</div>}
    </div>
  );
}
