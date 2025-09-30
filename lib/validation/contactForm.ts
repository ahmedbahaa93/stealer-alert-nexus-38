import * as yup from 'yup';

export const createContactFormSchema = (t: any) => {
  return yup.object({
    fullName: yup
      .string()
      .required(t('fields.inputs.0.error'))
      .min(2, t('validation.name.min'))
      .max(50, t('validation.name.max'))
      .matches(/^[a-zA-ZÀ-ÿ\u0600-\u06FF\s]+$/, t('validation.name.invalid')),

    email: yup
      .string()
      .required(t('fields.inputs.1.error'))
      .email(t('fields.inputs.1.invalid'))
      .max(100, t('validation.email.max')),

    subject: yup
      .string()
      .required(t('fields.select.error'))
      .min(3, t('validation.subject.min'))
      .max(100, t('validation.subject.max')),

    for: yup
      .string()
      .required(t('fields.radio_error'))
      .oneOf(['for business', 'for individual'], t('validation.type.invalid')),

    message: yup
      .string()
      .required(t('fields.text-area.error'))
      .min(10, t('validation.message.min'))
      .max(1000, t('validation.message.max')),

    country: yup
      .object({
        en: yup.string().required(),
        ar: yup.string().required()
      })
      .required(t('fields.country.error'))
  });
};

export type ContactFormValues = yup.InferType<
  ReturnType<typeof createContactFormSchema>
>;
