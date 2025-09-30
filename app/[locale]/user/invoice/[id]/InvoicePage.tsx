'use client';

import React, { useEffect, useState, useRef } from 'react';
import { InvoiceData, generateInvoice } from '@/lib/api/invoice';
import { FigmaInvoiceDesign } from './components';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { useTranslations } from 'next-intl';
import './invoice-styles.css';

interface InvoicePageProps {
    invoiceId: string;
}

export const InvoicePage: React.FC<InvoicePageProps> = ({ invoiceId }) => {
    const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPrinting, setIsPrinting] = useState(false);
    const invoiceRef = useRef<HTMLDivElement>(null);
    const t = useTranslations('invoice');

    const handleDownloadPDF = async () => {
        try {
            setIsPrinting(true);

            // Simple approach: use window.print for now since the HTML is properly formatted
            if (!invoiceRef.current) return;

            // Create a print-friendly window
            const printWindow = window.open('', '_blank');
            if (printWindow && invoiceRef.current) {
                const invoiceNumber = `INV${invoiceData?._id.slice(-6).toUpperCase()}`;
                printWindow.document.write(`
                    <html>
                        <head>
                            <title>Invoice ${invoiceNumber}</title>
                            <style>
                                body { 
                                    font-family: Inter, Helvetica, sans-serif; 
                                    margin: 20px;
                                    background-color: white;
                                    color: black;
                                }
                                @media print { 
                                    body { margin: 0; }
                                    * { color: black !important; background-color: white !important; }
                                }
                                .no-print { display: none !important; }
                                table { border-collapse: collapse; width: 100%; }
                                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                                th { background-color: #f2f2f2; }
                            </style>
                        </head>
                        <body>
                            ${invoiceRef.current.innerHTML}
                        </body>
                    </html>
                `);
                printWindow.document.close();

                // Wait a moment for content to load, then print
                setTimeout(() => {
                    printWindow.print();
                    printWindow.close();
                }, 500);
            }

        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Failed to generate PDF. Please try using your browser\'s print function (Ctrl+P) instead.');
        } finally {
            setIsPrinting(false);
        }
    };

    useEffect(() => {
        const fetchInvoiceData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Generate/fetch invoice using the payment ID
                const response = await generateInvoice(invoiceId);

                if (response.status === 'success' && response.data?.invoice) {
                    setInvoiceData(response.data.invoice);
                } else {
                    setError('Failed to generate invoice');
                }
            } catch (err: any) {
                console.error('Error fetching invoice data:', err);
                setError(err.response?.data?.message || 'Failed to load invoice data');
            } finally {
                setLoading(false);
            }
        };

        if (invoiceId) {
            fetchInvoiceData();
        }
    }, [invoiceId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!invoiceData) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-600 mb-4">Invoice Not Found</h2>
                    <p className="text-gray-600">The requested invoice could not be found.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto px-6">
                {/* PDF Download Button */}
                <div className="flex justify-end mb-8">
                    <Button
                        onClick={handleDownloadPDF}
                        disabled={isPrinting}
                        className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                        <Download size={20} />
                        {isPrinting ? t('printing') : t('downloadPdf')}
                    </Button>
                </div>

                {/* Invoice Content */}
                <div ref={invoiceRef} className="invoice-container bg-white rounded-lg shadow-lg p-8">
                    <FigmaInvoiceDesign invoiceData={invoiceData} />
                </div>
            </div>
        </div>
    );
};
