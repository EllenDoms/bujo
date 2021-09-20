import React from 'react';
import { format } from 'date-fns';
import { Formik } from 'formik';

import { addBulletStatus } from '../../supabase/bullets';
import { BulletStatusEnum, IBulletWithStatus } from '../../types/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { Button } from '../button/button';
import { InputField } from '../form/inputField';

import { Dialog } from './dialog';

interface Props {
  bulletStatus?: IBulletWithStatus;
  onClose: () => void;
  onMigrate: (newDate: Date, selectedBulletStatusId: string) => void;
  isShown: boolean;
  defaultDate: Date;
}

export function AddBulletStatusDialog({
  bulletStatus,
  defaultDate,
  isShown,
  onClose,
  onMigrate,
}: Props) {
  if (!bulletStatus?.data.id) return null;

  return (
    <Dialog isShown={isShown} onClose={onClose} title="Add new bullet">
      <Formik
        initialValues={{
          date: format(defaultDate, DATE_FORMAT.SUPABASE_DAY),
        }}
        onSubmit={(values, { setSubmitting }) => {
          addBulletStatus({
            bullet_id: bulletStatus.data.id,
            date: new Date(Date.parse(values.date)),
            status: BulletStatusEnum.OPEN,
          }).then((val) => {
            val?.date && onMigrate(val.date, bulletStatus.id);
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
              error={errors.date && touched.date && errors.date}
              handleChange={handleChange}
              label="date"
              onBlur={handleBlur}
              type="date"
              value={values.date}
              isRequired
            />
            <Button buttonType="submit" isDisabled={isSubmitting} label="Add bullet" />
          </form>
        )}
      </Formik>
    </Dialog>
  );
}