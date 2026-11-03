import { PaymentMethod } from '@prisma/client';
export declare class CreatePayment {
    amount: number;
    method: PaymentMethod;
    transactionId?: string;
    reference?: string;
    notes?: string;
}
