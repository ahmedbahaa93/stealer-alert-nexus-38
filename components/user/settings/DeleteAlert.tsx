'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useDeleteAccount } from '@/hooks/useSettings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface FormData {
  password: string;
}

function DeleteAlert() {
  const t = useTranslations('settings.delete');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutate: deleteAccount, isPending } = useDeleteAccount();

  // Create a schema for the password
  const schema = z.object({
    password: z.string().min(1, { message: 'Password is required' })
  });

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema)
  });

  const onSubmit = (data: FormData) => {
    setError(null);
    console.log('Submitting delete account form with endpoint: https://booking-courses-gilt.vercel.app/api/v1/user/delete-account');
    console.log('Form data:', { password: '******' });

    deleteAccount(
      { password: data.password },
      {
        onError: (error: any) => {
          console.error('Delete account error in component:', error);

          // Handle specific error codes
          if (error.response?.status === 401) {
            setError('Current password is incorrect');
          } else if (error.response?.status === 400) {
            // Try to extract a meaningful error message from the response
            const errorMessage = error.response?.data?.message ||
              error.response?.data?.error ||
              'Failed to delete account';
            setError(errorMessage);
          } else if (error.response?.status === 404) {
            setError('API endpoint not found. Please contact support.');
            console.error('API endpoint not found:', error.config?.url);
          } else {
            // Show more detailed error for debugging
            const errorDetail = error.message || 'Unknown error';
            setError(`Failed to delete account: ${errorDetail}`);
          }

          // Log detailed error information for debugging
          console.log('Full error details:', {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
            method: error.config?.method
          });
        },
        onSuccess: () => {
          // The redirect will happen in the hook
          setOpen(false);
          reset();
        }
      }
    );
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="lg"
          variant="outline"
          className="bg-primary-foreground hover:text-primary-foreground hover:border-primary-foreground mt-5 flex gap-2 rounded-lg border-2 border-red-500 text-red-500 drop-shadow-lg drop-shadow-[#00000040] duration-300 ease-in-out hover:bg-red-500"
        >
          {t('action')}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center text-lg md:text-2xl">
              <div className="flex w-full items-center justify-center">
                <Trash2 className="mb-5 h-20 w-20 text-red-500" />
              </div>
              {t('head')}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-lg text-[#80808080] md:text-2xl">
              {t('sub')}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="my-4">
            <Label htmlFor="password">Password</Label>
            <Input
              type="password"
              id="password"
              {...register('password')}
              placeholder="Enter your password to confirm"
              className="mt-1"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          {error && (
            <div className="p-3 mb-3 bg-red-50 text-red-800 border border-red-200 rounded-md">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel
              type="button"
              disabled={isPending}
              className="cursor-pointer"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              type="submit"
              onClick={handleSubmit(onSubmit)}
              disabled={isPending}
              className="cursor-pointer bg-red-800 text-white hover:bg-red-800/80"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Deleting account...</span>
                </div>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default DeleteAlert;

{
  /* <AlertDialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <AlertDialogTrigger asChild>
        <button
          onClick={() => {
            setIsModalOpen(true);
          }}
          className="text-destructive hover:text-destructive/80 cursor-pointer"
          title="Delete"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription className="text-dash-stat">
            This action cannot be undone. This will permanently delete{' '}
            {treatmentName} treatment and remove its data from the servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => setIsModalOpen(false)}
            className="cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              toast.info('deleting in progress');
              try {
                const res = await deleteTreatmentById(treatmentId);
                if (res?.success) {
                  toast.success(res.message);
                } else {
                  toast.error(res?.message || 'Failed to delete treatment.');
                }
              } catch {
                toast.error(`Failed to delete treatment "${treatmentName}".`);
              }
              setIsModalOpen(false);
            }}
            className="cursor-pointer bg-red-800 text-white hover:bg-red-800/80"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog> */
}
