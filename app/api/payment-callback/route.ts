import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Extract payment details from query params
  const status = searchParams.get('status');
  const code = searchParams.get('code') || searchParams.get('hmac');
  const message = searchParams.get('message');
  const transactionId =
    searchParams.get('transaction_id') || searchParams.get('id');
  const bookingStatus =
    searchParams.get('booking_status') || searchParams.get('success');
  const paymentStatus = searchParams.get('payment_status');
  const redirectUrl = searchParams.get('redirect_url');

  // Handle status codes according to backend specification
  // 303 = success, 307 = failure
  const statusCode = code ? parseInt(code) : 0;
  const isSuccess =
    statusCode === 303 || status === 'success' || bookingStatus === 'true';
  const isFailure =
    statusCode === 307 || status === 'failed' || status === 'error';

  // Create the response object
  const paymentResponse = {
    status: isSuccess ? 'success' : isFailure ? 'failed' : status || 'unknown',
    code: statusCode,
    message:
      message ||
      (isSuccess
        ? 'Payment completed successfully'
        : isFailure
          ? 'Payment failed'
          : 'Payment processed'),
    data: {
      transactionId: transactionId ? parseInt(transactionId) : null,
      bookingStatus: isSuccess
        ? 'Confirmed'
        : isFailure
          ? 'Failed'
          : bookingStatus || 'Unknown',
      paymentStatus: isSuccess
        ? 'Completed'
        : isFailure
          ? 'Failed'
          : paymentStatus || 'Unknown',
      redirectUrl: redirectUrl || null
    }
  };

  // Determine the correct redirect URL based on payment status
  let redirectPath: string;
  if (isSuccess) {
    redirectPath = '/payment-result';
  } else if (isFailure) {
    redirectPath = '/payment-result';
  } else {
    redirectPath = '/payment-result';
  }

  // Create redirect URL with proper locale detection
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

  if (transactionId) {
    resultUrl.searchParams.set('transaction_id', transactionId);
  }

  // Add status information
  resultUrl.searchParams.set('status', paymentResponse.status);
  resultUrl.searchParams.set('code', statusCode.toString());

  return NextResponse.redirect(resultUrl);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Extract status code to determine success/failure
    const statusCode = body.code || body.status_code || 0;
    const isSuccess = statusCode === 303 || body.status === 'success';
    const isFailure =
      statusCode === 307 || body.status === 'failed' || body.status === 'error';

    // Handle POST callback (webhook style)
    const paymentResponse = {
      status: isSuccess
        ? 'success'
        : isFailure
          ? 'failed'
          : body.status || 'unknown',
      code: statusCode,
      message:
        body.message ||
        (isSuccess
          ? 'Payment completed successfully'
          : isFailure
            ? 'Payment failed'
            : 'Payment processed'),
      data: {
        transactionId: body.data?.transactionId || body.transactionId,
        bookingStatus: isSuccess
          ? 'Confirmed'
          : isFailure
            ? 'Failed'
            : body.data?.bookingStatus || body.bookingStatus || 'Unknown',
        paymentStatus: isSuccess
          ? 'Completed'
          : isFailure
            ? 'Failed'
            : body.data?.paymentStatus || body.paymentStatus || 'Unknown',
        redirectUrl: body.data?.redirectUrl || body.redirectUrl
      }
    };

    // Determine redirect path based on status
    const redirectPath = '/payment-result';

    // For POST requests, we'll return the data and let the frontend handle the redirect
    return NextResponse.json({
      success: true,
      paymentResponse,
      redirectUrl: `/en${redirectPath}?payment_data=${encodeURIComponent(JSON.stringify(paymentResponse))}&success=${isSuccess ? 'true' : 'false'}${paymentResponse.data.transactionId ? `&transaction_id=${paymentResponse.data.transactionId}` : ''}&status=${paymentResponse.status}&code=${statusCode}`
    });
  } catch (error) {
    console.error('Payment callback error:', error);
    return NextResponse.json(
      { error: 'Invalid payment callback data' },
      { status: 400 }
    );
  }
}
