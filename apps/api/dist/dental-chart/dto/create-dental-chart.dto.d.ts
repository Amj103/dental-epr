import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';
declare class DentalSurfaceDto {
    surface: ToothSurface;
    condition: SurfaceCondition;
    notes?: string;
}
export declare class CreateDentalChartDto {
    toothNumber: string;
    condition?: ToothCondition;
    notes?: string;
    surfaces?: DentalSurfaceDto[];
}
export {};
