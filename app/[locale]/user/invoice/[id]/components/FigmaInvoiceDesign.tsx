import React from "react";
import { InvoiceData } from '@/lib/api/invoice';
import { GroupsSection, MainContentSection } from "./sections";

interface FigmaInvoiceDesignProps {
    invoiceData: InvoiceData;
}

export const FigmaInvoiceDesign: React.FC<FigmaInvoiceDesignProps> = ({ invoiceData }) => {
    return (
        <div className="bg-transparent flex justify-center w-full">
            <main className="w-full max-w-5xl flex flex-col bg-white space-y-0">
                <section className="w-full">
                    <MainContentSection invoiceData={invoiceData} />
                </section>

                <section className="w-full">
                    <GroupsSection invoiceData={invoiceData} />
                </section>
            </main>
        </div>
    );
};
