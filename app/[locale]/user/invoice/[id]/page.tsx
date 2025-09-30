'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { InvoicePage } from '.';

export default function Invoice() {
    const params = useParams();
    const invoiceId = params.id as string;

    return <InvoicePage invoiceId={invoiceId} />;
}
