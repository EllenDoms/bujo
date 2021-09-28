import React from 'react';
import { addDays, format } from 'date-fns';
import { Formik } from 'formik';

import { addBulletStatus } from '../../supabase/bullets.store';
import { BulletStatusEnum, IBulletWithStatus } from '../../types/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { Button } from '../button/button';
import { InputField } from '../form/inputField';

import { SidePanel } from './sidePanel';

interface Props {
  bulletStatus?: IBulletWithStatus;
  onClose: () => void;
  onMigrate: (newDate: Date, selectedBullet: IBulletWithStatus) => void;
  isShown: boolean;
}

export function AddBulletStatusSidePanel({ bulletStatus, isShown, onClose, onMigrate }: Props) {
  return (
    <SidePanel isShown={isShown} onClose={onClose} title={`Migrate ${bulletStatus?.data.title}`}>
      {bulletStatus?.data.id && (
        <Formik
          initialValues={{
            date: addDays(new Date(bulletStatus.date), 1),
          }}
          onSubmit={(values, { setSubmitting }) => {
            addBulletStatus({
              bullet_id: bulletStatus.data.id,
              date: values.date,
              status: BulletStatusEnum.OPEN,
            }).then((val) => {
              val?.date && onMigrate(val.date, bulletStatus);
              onClose();
            });
          }}
          validate={(values) => {
            let errors = {};
            if (!values.date) {
              errors = { ...errors, date: 'Required' };
            }

            return errors;
          }}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
            <form onSubmit={handleSubmit}>
              <InputField
                handleChange={handleChange}
                label="date"
                onBlur={handleBlur}
                type="date"
                value={format(values.date, DATE_FORMAT.SUPABASE_DAY)}
                isRequired
              />
              <Button buttonType="submit" isDisabled={isSubmitting} label="Migrate bullet" />
            </form>
          )}
        </Formik>
      )}
    </SidePanel>
  );
}
