import React, { useEffect } from 'react';
import { format } from 'date-fns';

import { BulletList } from '../../../components/bullet/bulletList';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { groupBy } from '../../../hooks/groupBy';
import { handleStatusChange } from '../../../hooks/useStatusUpdate';
import { useBulletContext } from '../../../supabase/bullets.store';
import { BulletStatusEnum, IBulletWithStatus } from '../../../types/bullets';
import { DATE_FORMAT, TimeframesEnum } from '../../../types/dates';

type Props = {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  setMigratingBullet: (bullet: IBulletWithStatus) => void;
};

export function DayView({ selectedDate, setMigratingBullet, setSelectedDate }: Props) {
  const { bulletsWithStatus, initialLoading, setStartDate, setTimeframe } = useBulletContext();

  useEffect(() => {
    setStartDate && setStartDate(selectedDate);
    setTimeframe && setTimeframe(TimeframesEnum.DAY);
  }, [selectedDate, setStartDate, setTimeframe]);

  // TODO grouping should not be necessary since we fetch again, but the loading state is too long on false?
  const groupedBulletsWithStatus =
    (bulletsWithStatus &&
      groupBy(bulletsWithStatus, (i) => format(new Date(i.date), DATE_FORMAT.SUPABASE_DAY))) ||
    [];

  return (
    <div className="flex flex-col items-center pt-4 px-4">
      <WeekCalendar selectedDate={selectedDate} setSelectedDate={(day) => setSelectedDate(day)} />
      {selectedDate && (
        <h1 className="my-6 font-semibold text-rose-500 text-lg">
          {format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}
        </h1>
      )}
      {!initialLoading && groupedBulletsWithStatus && (
        <BulletList
          bulletsWithStatus={
            groupedBulletsWithStatus[format(selectedDate, DATE_FORMAT.SUPABASE_DAY)]
          }
          date={selectedDate}
          onChangeBulletStatus={(newStatus, bulletStatus) =>
            newStatus === BulletStatusEnum.MIGRATED
              ? setMigratingBullet(bulletStatus)
              : handleStatusChange(bulletStatus, newStatus)
          }
        />
      )}
    </div>
  );
}
