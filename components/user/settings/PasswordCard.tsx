'use client';

import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Card from '../Card';
import Heading from '../Heading';
import Border from './Border';
import { useChangePassword } from '@/hooks/useSettings';

const createFormSchema = (t: any) => z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: t('current_password.error') }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters long" })
      .refine(
        (password) => {
          // At least one lowercase letter
          const hasLowercase = /[a-z]/.test(password);
          // At least one uppercase letter
          const hasUppercase = /[A-Z]/.test(password);
          // At least one digit
          const hasDigit = /\d/.test(password);
          // At least one special character
          const hasSpecial = /[@$!%*?&#]/.test(password);

          return hasLowercase && hasUppercase && hasDigit && hasSpecial;
        },
        { message: "Password must include uppercase, lowercase, number and special character" }
      ),
    confirmNewPassword: z
      .string()
      .min(1, { message: t('confirm_new_password.error') })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: t('password_mismatch'),
    path: ['confirmNewPassword']
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

function PasswordCard() {
  const t = useTranslations('settings.pass');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [apiMessage, setApiMessage] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const { mutate: changePassword, isPending } = useChangePassword();

  const formSchema = createFormSchema(t);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = (data: FormData) => {
    setApiMessage(null);
    console.log('Submitting password change form');

    // Make sure passwords match before sending to API
    if (data.newPassword !== data.confirmNewPassword) {
      setApiMessage({
        type: 'error',
        message: t('password_mismatch')
      });
      return;
    }

    // Log the data we're about to send
    console.log('Sending password change data to endpoint: https://booking-courses-gilt.vercel.app/api/v1/user/change-password', {
      currentPassword: '***REDACTED***',
      newPassword: '***REDACTED***',
      confirmPassword: '***REDACTED***'
    });

    changePassword(
      {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmNewPassword
      },
      {
        onSuccess: (response) => {
          console.log('Password change success response:', response);
          setApiMessage({
            type: 'success',
            message: t('api.success')
          });
          reset(); // Clear the form
        },
        onError: (error: any) => {
          console.error('Password change error in component:', error);

          // Handle specific error codes
          if (error.response?.status === 401) {
            setApiMessage({
              type: 'error',
              message: t('current_password.error') || 'Current password is incorrect'
            });
          } else if (error.response?.status === 400) {
            // Try to extract a meaningful error message from the response
            const errorMessage = error.response?.data?.message ||
              error.response?.data?.error ||
              t('api.error');
            setApiMessage({
              type: 'error',
              message: errorMessage
            });
          } else {
            // Show more detailed error for debugging
            const errorDetail = error.message || 'Unknown error';
            setApiMessage({
              type: 'error',
              message: `${t('api.error')} (${errorDetail})`
            });
          }

          // Log detailed error information for debugging
          console.log('Full error details:', {
            message: error.message,
            response: error.response,
            request: error.request
          });
        }
      }
    );
  };

  return (
    <Card>
      <Heading data={t('title')} />
      <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-6">
        {/* Current Password */}
        <div className="md:w-1/2">
          <Label htmlFor="currentPassword">{t('current_password.label')}</Label>
          <div className="relative">
            <Border>
              <Input
                id="currentPassword"
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder={t('current_password.placeholder')}
                {...register('currentPassword')}
              />
            </Border>
            <span
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {errors.currentPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.currentPassword.message}
            </p>
          )}
        </div>

        {/* New Password */}
        <div className="md:w-1/2">
          <Label htmlFor="newPassword">{t('new_password.label')}</Label>
          <div className="relative">
            <Border>
              <Input
                id="newPassword"
                type={showNewPassword ? 'text' : 'password'}
                placeholder={t('new_password.placeholder')}
                {...register('newPassword')}
              />
            </Border>
            <span
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {errors.newPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Confirm New Password */}
        <div className="md:w-1/2">
          <Label htmlFor="confirmNewPassword">
            {t('confirm_new_password.label')}
          </Label>
          <div className="relative">
            <Border>
              <Input
                id="confirmNewPassword"
                type={showConfirmNewPassword ? 'text' : 'password'}
                placeholder={t('confirm_new_password.placeholder')}
                {...register('confirmNewPassword')}
              />
            </Border>
            <span
              className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3"
              onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
            >
              {showConfirmNewPassword ? (
                <EyeOff size={20} />
              ) : (
                <Eye size={20} />
              )}
            </span>
          </div>
          {errors.confirmNewPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* API response message */}
        {apiMessage && (
          <div
            className={`p-4 mb-4 rounded-md ${apiMessage.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
              }`}
          >
            <div className="flex items-center gap-2">
              {apiMessage.type === 'success' ? (
                <CheckCircle className="h-5 w-5" />
              ) : (
                <AlertCircle className="h-5 w-5" />
              )}
              <p className="text-sm font-medium">{apiMessage.message}</p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-center">
          <Button
            type="submit"
            size="lg"
            variant="outline"
            disabled={isPending}
            className="bg-primary-foreground text-primary-identity border-primary-identity hover:bg-primary-identity hover:text-primary-foreground hover:border-primary-foreground mt-5 flex gap-2 rounded-lg border-2 drop-shadow-lg drop-shadow-[#00000040] duration-300 ease-in-out"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('api.changing')}</span>
              </>
            ) : (
              t('change_password_button')
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default PasswordCard;
