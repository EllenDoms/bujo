import React from 'react';
import { format } from 'date-fns';
import { Formik } from 'formik';

import { addBullet, addBulletStatus } from '../../supabase/bullets';
import { BulletStatusEnum, BulletTypeEnum } from '../../types/bullets';
import { DATE_FORMAT } from '../../types/dates';
import { Button } from '../button/button';
import { DropdownField } from '../form/dropdownField';
import { InputField } from '../form/inputField';
import { TextareaField } from '../form/textareaField';

import { Dialog } from './dialog';

interface Props {
  onClose: () => void;
  isShown: boolean;
  defaultDate: Date;
}

export function AddBulletDialog({ defaultDate, isShown, onClose }: Props) {
  return (
    <Dialog isShown={isShown} onClose={onClose} title="Add new bullet">
      <Formik
        initialValues={{
          title: '',
          description: '',
          type: BulletTypeEnum.TODO,
          date: format(defaultDate, DATE_FORMAT.SUPABASE_DAY),
        }}
        onSubmit={(values, { setSubmitting }) => {
          addBullet({
            title: values.title,
            description: values.description,
            type: values.type as BulletTypeEnum,
          })
            .then(
              (res) =>
                res &&
                addBulletStatus({
                  bullet_id: res.id,
                  date: new Date(Date.parse(values.date)),
                  status: BulletStatusEnum.OPEN,
                }),
            )
            .then(() => onClose());
        }}
        validate={(values) => {
          let errors = {};
          if (!values.title) {
            errors = { ...errors, title: 'Required' };
          }
          if (!values.type) {
            errors = { ...errors, type: 'Required' };
          }
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
            <InputField
              error={errors.title && touched.title && errors.title}
              handleChange={handleChange}
              label="title"
              onBlur={handleBlur}
              type="text"
              value={values.title}
              isRequired
            />
            <TextareaField
              error={errors.description && touched.description && errors.description}
              handleChange={handleChange}
              label="description"
              onBlur={handleBlur}
              value={values.description}
            />
            <DropdownField
              error={errors.type && touched.type && errors.type}
              handleChange={handleChange}
              label="type"
              onBlur={handleBlur}
              options={[
                BulletTypeEnum.TODO,
                BulletTypeEnum.EVENT,
                BulletTypeEnum.BIRTHDAY,
                BulletTypeEnum.NOTE,
              ]}
              value={values.type}
              isRequired
            />
            <Button buttonType="submit" isDisabled={isSubmitting} label="Add bullet" />
          </form>
        )}
      </Formik>
    </Dialog>
  );
}
