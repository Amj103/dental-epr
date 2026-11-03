export declare class CreateInvoiceItemDto {
    description: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
    taxRate?: number;
    treatmentProcedureId?: string;
}
export declare class CreateInvoiceDto {
    patientId: string;
    treatmentPlanId?: string;
    dueDate?: string;
    notes?: string;
    items: CreateInvoiceItemDto[];
}
