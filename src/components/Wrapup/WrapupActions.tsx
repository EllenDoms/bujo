import React from 'react';
import { format } from 'date-fns';
import { Formik } from 'formik';

import { handleStatusChange } from '../../hooks/useStatusUpdate';
import { BulletStatusEnum, IBulletWithStatus } from '../../types/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { Button } from '../button/button';
import { InputField } from '../form/inputField';

interface Props {
  selectedBullet: IBulletWithStatus;
  goToNextBullet: () => void;
}

export function WrapupActions({ goToNextBullet, selectedBullet }: Props) {
  const handleAction = (newStatus: BulletStatusEnum, selectedDate?: Date) => {
    selectedBullet && handleStatusChange(selectedBullet, newStatus);
    goToNextBullet();
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        <Button label="Irrelevant" onClick={() => handleAction(BulletStatusEnum.IRRELEVANT)} />
        <Button label="Done" onClick={() => handleAction(BulletStatusEnum.DONE)} />
      </div>
      <div>
        <Formik
          initialValues={{
            date: format(new Date(), DATE_FORMAT.SUPABASE_DAY),
          }}
          onSubmit={(values, { setSubmitting }) => {
            handleAction(BulletStatusEnum.MIGRATED, new Date(values.date));
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
            <form className="flex flex-row items-center gap-2" onSubmit={handleSubmit}>
              <InputField
                error={errors.date && touched.date && errors.date}
                handleChange={handleChange}
                onBlur={handleBlur}
                type="date"
                value={values.date}
              />
              <Button buttonType="submit" label="Migrate" />
            </form>
          )}
        </Formik>
      </div>
    </div>
  );
}
