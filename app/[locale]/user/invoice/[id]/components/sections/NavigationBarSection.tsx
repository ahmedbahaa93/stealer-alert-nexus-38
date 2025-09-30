import React from "react";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useTranslations } from 'next-intl';

export const NavigationBarSection = () => {
    const t = useTranslations('invoice');

    // Define column headers data for easy mapping
    const columns = [
        {
            id: "description",
            label: t('description').toUpperCase(),
            className: "text-left",
        },
        { id: "qty", label: t('qty').toUpperCase(), className: "text-center" },
        { id: "rate", label: t('rate').toUpperCase(), className: "text-left" },
        { id: "total", label: t('total').toUpperCase(), className: "text-right" },
    ];

    return (
        <div className="w-full relative mb-4">
            <Table>
                <TableHeader>
                    <TableRow className="border-b-2 border-gray-200">
                        {columns.map((column) => (
                            <TableHead
                                key={column.id}
                                className={`h-12 text-sm font-bold text-gray-600 tracking-wide border-0 px-4 py-3 ${column.className}`}
                            >
                                {column.label}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
            </Table>
        </div>
    );
};
