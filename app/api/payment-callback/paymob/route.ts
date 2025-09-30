import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Paymob specific parameters
  const success = searchParams.get('success');
  const id = searchParams.get('id'); // Paymob transaction ID
  const pending = searchParams.get('pending');
  const amount = searchParams.get('amount_cents');
  const currency = searchParams.get('currency');
  const order = searchParams.get('order');
  const integration_id = searchParams.get('integration_id');
  const hmac = searchParams.get('hmac');
  const code = searchParams.get('code');

  // Handle status codes according to backend specification
  // 303 = success, 307 = failure
  const statusCode = code
    ? parseInt(code)
    : success === 'true'
      ? 303
      : success === 'false'
        ? 307
        : 200;
  const isSuccess = statusCode === 303 || success === 'true';
  const isFailure = statusCode === 307 || success === 'false';
  const isPending = pending === 'true';

  // Create Paymob response structure
  const paymentResponse = {
    status: isSuccess
      ? 'success'
      : isFailure
        ? 'failed'
        : isPending
          ? 'pending'
          : 'unknown',
    code: statusCode,
    message: isSuccess
      ? 'Payment confirmed! Your booking has been successfully completed.'
      : isFailure
        ? 'Payment failed or was cancelled.'
        : isPending
          ? 'Payment is being processed.'
          : 'Payment status unknown.',
    data: {
      transactionId: id ? parseInt(id) : null,
      bookingStatus: isSuccess
        ? 'Confirmed'
        : isFailure
          ? 'Failed'
          : isPending
            ? 'Pending'
            : 'Unknown',
      paymentStatus: isSuccess
        ? 'Completed'
        : isFailure
          ? 'Failed'
          : isPending
            ? 'Pending'
            : 'Unknown',
      amount: amount ? parseInt(amount) / 100 : null, // Convert cents to pounds
      currency: currency || 'EGP',
      order: order,
      integration_id: integration_id,
      hmac: hmac,
      redirectUrl: 'https://raiseup-front.vercel.app/en/payments'
    }
  };

  // Determine redirect path based on status
  const redirectPath = '/payment-result';

  // Store the payment response and redirect to payment result page
  const host = request.headers.get('host') || 'localhost:3000';
  const protocol = request.headers.get('x-forwarded-proto') || 'http';
  const baseUrl = `${protocol}://${host}`;

  // Extract locale from original request or default to 'en'
  const referer = request.headers.get('referer') || '';
  const localeMatch = referer.match(/\/(en|ar)\//);
  const locale = localeMatch ? localeMatch[1] : 'en';

  const resultUrl = new URL(`/${locale}${redirectPath}`, baseUrl);
  resultUrl.searchParams.set(
    'payment_data',
    encodeURIComponent(JSON.stringify(paymentResponse))
  );
  resultUrl.searchParams.set('success', isSuccess ? 'true' : 'false');
  resultUrl.searchParams.set('provider', 'paymob');
  resultUrl.searchParams.set('status', paymentResponse.status);
  resultUrl.searchParams.set('code', statusCode.toString());

  if (id) {
    resultUrl.searchParams.set('transaction_id', id);
  }

  return NextResponse.redirect(resultUrl);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Paymob webhook

    // For webhooks, just return success - the actual redirect happens in GET
    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Paymob webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid webhook data' },
      { status: 400 }
    );
  }
}
