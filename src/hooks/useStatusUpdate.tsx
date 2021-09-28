import { removeFutureBulletStatuses, updateBulletStatus } from '../supabase/bullets.store';
import { BulletStatusEnum, IBulletWithStatus } from '../types/bullets';

export const handleStatusChange = (
  selectedBullet: IBulletWithStatus,
  newStatus: BulletStatusEnum,
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
    removeFutureBulletStatuses(bulletId, selectedBullet.date);
  }

  updateBulletStatus(bulletStatusId, { status: newStatus });
};
