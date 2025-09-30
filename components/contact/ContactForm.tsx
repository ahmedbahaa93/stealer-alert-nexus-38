'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import Card from './Card';
import Border from './Border';
import GrowAnimation from '../GrowAnimation';
import ContactFormNotification from './ContactFormNotification';

import { createContactFormSchema, ContactFormValues } from '@/lib/validation/contactForm';
import { useContactForm } from '@/hooks/useContactForm';
import { ContactFormError } from '@/lib/api/contact';

// List of countries in English and Arabic
const countries = [
  { en: "Egypt", ar: "مصر" },
  { en: "Saudi Arabia", ar: "المملكة العربية السعودية" },
  { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
  { en: "Kuwait", ar: "الكويت" },
  { en: "Qatar", ar: "قطر" },
  { en: "Bahrain", ar: "البحرين" },
  { en: "Oman", ar: "عُمان" },
  { en: "Jordan", ar: "الأردن" },
  { en: "Lebanon", ar: "لبنان" },
  { en: "Iraq", ar: "العراق" },
  { en: "United States", ar: "الولايات المتحدة" },
  { en: "United Kingdom", ar: "المملكة المتحدة" },
  { en: "France", ar: "فرنسا" },
  { en: "Germany", ar: "ألمانيا" },
  { en: "Other", ar: "أخرى" }
];

export function ContactForm() {
  const t = useTranslations('contact-page.form.form');
  const locale = useLocale();
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState<'success' | 'error' | 'loading'>('loading');

  const formSchema = createContactFormSchema(t);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: yupResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      for: 'for individual' // Set a default value for the radio buttons
    }
  });

  const { submitForm, isLoading, isError, error, reset: resetMutation } = useContactForm({
    onSuccess: () => {
      setNotificationType('success');
      setShowNotification(true);
      reset(); // Reset form on success
      // Auto-hide success notification after 5 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    },
    onError: () => {
      setNotificationType('error');
      setShowNotification(true);
      // Auto-hide error notification after 10 seconds
      setTimeout(() => {
        setShowNotification(false);
      }, 10000);
    }
  });

  // Show loading notification when form is being submitted
  useEffect(() => {
    if (isLoading) {
      setNotificationType('loading');
      setShowNotification(true);
    }
  }, [isLoading]);

  const onSubmit = (data: ContactFormValues) => {
    // Debug: Log form data on submission
    console.log('Form data being submitted:', data);
    console.log('For value:', data.for);

    // No need to transform values, they already match the API expectations
    submitForm(data);
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
    if (isError) {
      resetMutation();
    }
  };

  const inputsData = t.raw('fields.inputs');
  const selectData = t.raw('fields.select');
  const radioData = t.raw('fields.radio');
  const textareaData = t.raw('fields.text-area');

  return (
    <>
      <ContactFormNotification
        isVisible={showNotification}
        type={notificationType}
        error={error as ContactFormError}
        onClose={handleCloseNotification}
      />

      <Card title={t('title')} src="telegram" alt="contact-icon">
        <GrowAnimation scale={1.02}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-7 flex flex-col h-full">
            {/* Input Fields */}
            {(inputsData as any[]).map((input: any, index: number) => {
              const fieldName = input.label.toLowerCase() === 'name' ? 'fullName' : 'email';
              return (
                <div key={index}>
                  <Label htmlFor={fieldName}>{input.label}</Label>
                  <Border>
                    <Input
                      id={fieldName}
                      placeholder={input['place-holder']}
                      disabled={isLoading}
                      {...register(fieldName)}
                      className={errors[fieldName] ? 'border-red-500' : ''}
                    />
                  </Border>
                  {errors[fieldName] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[fieldName]?.message}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Select Field for Subject */}
            <div>
              <Label htmlFor="subject">{(selectData as any).title}</Label>
              <Border>
                <Select
                  onValueChange={(value) => setValue('subject', value, { shouldValidate: true })}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="subject"
                    className={`w-full ${errors.subject ? 'border-red-500' : ''}`}
                  >
                    <SelectValue
                      placeholder={(selectData as any)['place-holder']}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {(selectData as any).option.map(
                      (option: string, index: number) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </Border>
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.subject.message}
                </p>
              )}
            </div>

            {/* Select Field for Country */}
            <div>
              <Label htmlFor="country">{t('fields.country.label')}</Label>
              <Border>
                <Select
                  onValueChange={(value) => {
                    const selectedCountry = countries.find(c => c.en === value);
                    if (selectedCountry) {
                      setValue('country', {
                        en: selectedCountry.en,
                        ar: selectedCountry.ar
                      }, { shouldValidate: true });
                    }
                  }}
                  disabled={isLoading}
                >
                  <SelectTrigger
                    id="country"
                    className={`w-full ${errors.country ? 'border-red-500' : ''}`}
                  >
                    <SelectValue
                      placeholder={t('fields.country.place-holder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country, index) => (
                      <SelectItem key={index} value={country.en}>
                        {locale === 'ar' ? country.ar : country.en}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Border>
              {errors.country && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            {/* Radio Buttons */}
            <div>
              <Label className="block mb-2">{locale === 'ar' ? 'ل' : 'For'}</Label>
              <RadioGroup
                defaultValue="for individual"
                onValueChange={(value) => {
                  console.log('Selected radio value:', value);
                  setValue('for', value, { shouldValidate: true });
                }}
                className="flex space-x-4 rtl:space-x-reverse"
                disabled={isLoading}
              >
                {(radioData as any[]).map((item: string, index: number) => {
                  // Set the value to match the expected format in the API: "for individual" or "for business"
                  const formattedValue = `for ${item.replace(/^For\s+/i, '').toLowerCase()}`;

                  return (
                    <div key={index} className="flex items-center space-x-2 rtl:space-x-reverse">
                      <RadioGroupItem
                        value={formattedValue}
                        id={`for-${index}`}
                        disabled={isLoading}
                      />
                      <Label htmlFor={`for-${index}`}>{item}</Label>
                    </div>
                  );
                })}
              </RadioGroup>
              {errors.for && (
                <p className="mt-1 text-sm text-red-500">{errors.for.message}</p>
              )}
            </div>

            {/* Text Area */}
            <div>
              <Label htmlFor="message">{(textareaData as any).label}</Label>
              <Border>
                <Textarea
                  id="message"
                  placeholder={(textareaData as any)['place-holder']}
                  disabled={isLoading}
                  {...register('message')}
                  className={`min-h-[120px] resize-y ${errors.message ? 'border-red-500' : ''}`}
                />
              </Border>
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.message.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? t('sending') : t('send')}
            </Button>
          </form>
        </GrowAnimation>
      </Card>
    </>
  );
}
