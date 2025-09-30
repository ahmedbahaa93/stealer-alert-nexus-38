import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Stripe specific parameters
  const success = searchParams.get('success');
  const sessionId = searchParams.get('session_id');
  const payment_status = searchParams.get('payment_status');
  const payment_intent = searchParams.get('payment_intent');
  const code = searchParams.get('code');

  // Handle status codes according to backend specification
  // 201 = success, 400 = failure
  const statusCode = code
    ? parseInt(code)
    : success === 'true'
      ? 201
      : success === 'false'
        ? 400
        : 200;
  const isSuccess =
    statusCode === 201 || success === 'true' || payment_status === 'paid';
  const isFailure =
    statusCode === 400 || success === 'false' || payment_status === 'failed';

  // Create Stripe response structure matching the expected format
  const paymentResponse = {
    status: isSuccess ? 'success' : isFailure ? 'failed' : 'unknown',
    code: statusCode,
    message: isSuccess
      ? 'Payment successful! Your enrollment has been confirmed.'
      : isFailure
        ? 'Payment failed or was cancelled.'
        : 'Payment status unknown.',
    data: {
      transactionId: payment_intent
        ? payment_intent.split('_')[1]
        : sessionId?.split('_')[2] || Math.floor(Math.random() * 1000000),
      bookingStatus: isSuccess ? 'Confirmed' : isFailure ? 'Failed' : 'Unknown',
      paymentStatus: isSuccess ? 'Completed' : isFailure ? 'Failed' : 'Unknown',
      sessionId: sessionId,
      paymentIntent: payment_intent,
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
  resultUrl.searchParams.set('provider', 'stripe');
  resultUrl.searchParams.set('status', paymentResponse.status);
  resultUrl.searchParams.set('code', statusCode.toString());

  if (sessionId) {
    resultUrl.searchParams.set('session_id', sessionId);
  }

  return NextResponse.redirect(resultUrl);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Handle Stripe webhook
    console.log('Stripe webhook received:', {
      type: body.type,
      session_id: body.data?.object?.id,
      payment_status: body.data?.object?.payment_status,
      amount_total: body.data?.object?.amount_total
    });

    // For webhooks, just return success - the actual redirect happens in GET
    return NextResponse.json({
      success: true,
      message: 'Webhook received'
    });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return NextResponse.json(
      { error: 'Invalid webhook data' },
      { status: 400 }
    );
  }
}
