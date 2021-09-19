import React, { useState } from 'react';
import { format } from 'date-fns';

import { Bullet } from '../../../components/bullet/bullet';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { updateBulletStatus, useBulletsStore } from '../../../supabase/bullets';
import { BulletStatusEnum } from '../../../types/bullets';
import { DATE_FORMAT } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { bulletsWithStatus, setBulletsWithStatus } = useBulletsStore({ selectedDate });

  const handleStatusDoneToggle = (bulletStatusId: string, oldStatus: BulletStatusEnum) => {
    // TODO: remove all future statuses for this bullet when opening or
    const newStatus =
      bulletsWithStatus.find((bulletStatus) => bulletStatus.id === bulletStatusId)?.status ===
      BulletStatusEnum.OPEN
        ? BulletStatusEnum.DONE
        : BulletStatusEnum.OPEN;

    return handleStatus(bulletStatusId, oldStatus, newStatus);
  };

  const handleStatus = (
    bulletStatusId: string,
    oldStatus: BulletStatusEnum,
    newStatus: BulletStatusEnum,
  ) => {
    if (oldStatus === BulletStatusEnum.MIGRATED) {
      const res = window.confirm('Are you sure you want to open this migrated bullet again?');
      if (res === false) return;
    }

    bulletsWithStatus.find((t, i) => {
      if (t.id === bulletStatusId) {
        bulletsWithStatus[i].status = newStatus;

        return true;
      } else {
        return false;
      }
    });
    setBulletsWithStatus([...bulletsWithStatus]);
    updateBulletStatus(bulletStatusId, { status: newStatus });
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <WeekCalendar showDetailsHandle={(day) => setSelectedDate(day)} />
      {selectedDate && <h1 className="mt-4">{format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}</h1>}
      {bulletsWithStatus && (
        <div className="w-full max-w-md flex flex-col justify-items-start">
          {bulletsWithStatus.map((bulletStatus) => (
            <Bullet
              key={bulletStatus.id}
              onClickDone={() => handleStatusDoneToggle(bulletStatus.id, bulletStatus.status)}
              status={bulletStatus.status}
              type={bulletStatus.data.type}
            >
              {bulletStatus.data.title}
            </Bullet>
          ))}
        </div>
      )}
    </div>
  );
}
