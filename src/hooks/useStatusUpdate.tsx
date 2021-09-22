import { removeFutureBulletStatuses, updateBulletStatus } from '../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../types/bullets';

export const handleStatusChange = (
  selectedBullet: IBulletWithStatus,
  newStatus: BulletStatusEnum,
  selectedDate: Date,
) => {
  const bulletId = selectedBullet.data.id;
  const bulletStatusId = selectedBullet.id;
  const oldStatus = selectedBullet?.status;

  if (oldStatus === BulletStatusEnum.MIGRATED) {
    const res = window.confirm(
      'Are you sure you want to open this migrated bullet again? We will remove all future references.',
    );
    if (res === false) return;
    // If old status is migrated, future references should be removed
    removeFutureBulletStatuses(bulletId, selectedDate);
  }

  updateBulletStatus(bulletStatusId, { status: newStatus });

  //   bulletsWithStatus.find((t, i) => {
  //     if (t.id === bulletStatusId) {
  //       bulletsWithStatus[i].status = newStatus;

  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });

  //   setBulletsWithStatus([...bulletsWithStatus]);

  //   return { newBulletsWithStatus: [...bulletsWithStatus] };
};
