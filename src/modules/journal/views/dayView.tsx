import React, { useState } from 'react';
import { addDays, format, startOfDay } from 'date-fns';

import { Bullet } from '../../../components/bullet/bullet';
import { FloatingButton } from '../../../components/button/floatingButton';
import WeekCalendar from '../../../components/calendar/weekCalendar';
import { AddBulletDialog } from '../../../components/dialog/addBulletDialog';
import { AddBulletStatusDialog } from '../../../components/dialog/addBulletStatusDialog';
import {
  removeFutureBulletStatuses,
  updateBulletStatus,
  useBulletsStore,
} from '../../../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../../../types/bullets';
import { DATE_FORMAT } from '../../../types/dates';

export function DayView() {
  const [selectedDate, setSelectedDate] = useState<Date>(startOfDay(new Date()));
  const [showAddBulletDialog, setShowAddBulletDialog] = useState<boolean>(false);
  const [migratingBullet, setMigratingBullet] = useState<IBulletWithStatus | undefined>(undefined);

  const { bulletsWithStatus, setBulletsWithStatus } = useBulletsStore({ selectedDate });

  const handleStatus = (
    bulletId: string,
    bulletStatusId: string,
    oldStatus: BulletStatusEnum,
    newStatus: BulletStatusEnum,
  ) => {
    if (oldStatus === BulletStatusEnum.MIGRATED) {
      const res = window.confirm(
        'Are you sure you want to open this migrated bullet again? We will remove all future references.',
      );
      if (res === false) return;
      // If old status is migrated, future references should be removed
      removeFutureBulletStatuses(bulletId, selectedDate);
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

  const handleMigrate = (newDate: Date, selectedBulletStatusId: string) => {
    const selectedBullet = bulletsWithStatus.find((bullet) => bullet.id === selectedBulletStatusId);
    selectedBullet &&
      handleStatus(
        selectedBullet.data.id,
        selectedBullet.id,
        selectedBullet?.status,
        BulletStatusEnum.MIGRATED,
      );
    setSelectedDate(startOfDay(new Date(newDate)));
  };

  return (
    <div className="flex flex-col items-center py-8 px-4">
      <WeekCalendar selectedDate={selectedDate} setSelectedDate={(day) => setSelectedDate(day)} />
      {selectedDate && (
        <h1 className="mt-4 font-semibold text-rose-500 text-lg">
          {format(selectedDate, DATE_FORMAT.DATE_WRITTEN)}
        </h1>
      )}
      {bulletsWithStatus && (
        <div className="w-full max-w-md flex flex-col justify-items-start">
          {bulletsWithStatus.map((bulletStatus) => (
            <Bullet
              key={bulletStatus.id}
              onChangeBulletStatus={(newStatus) =>
                newStatus === BulletStatusEnum.MIGRATED
                  ? setMigratingBullet(bulletStatus)
                  : handleStatus(
                      bulletStatus.data.id,
                      bulletStatus.id,
                      bulletStatus.status,
                      newStatus,
                    )
              }
              status={bulletStatus.status}
              type={bulletStatus.data.type}
            >
              {bulletStatus.data.title}
            </Bullet>
          ))}
        </div>
      )}
      <FloatingButton onClick={() => setShowAddBulletDialog(true)} />
      <AddBulletDialog
        defaultDate={selectedDate}
        isShown={showAddBulletDialog}
        onClose={() => setShowAddBulletDialog(false)}
      />
      <AddBulletStatusDialog
        bulletStatus={migratingBullet}
        defaultDate={addDays(selectedDate, 1)}
        isShown={migratingBullet ? true : false}
        onClose={() => setMigratingBullet(undefined)}
        onMigrate={handleMigrate}
      />
    </div>
  );
}
