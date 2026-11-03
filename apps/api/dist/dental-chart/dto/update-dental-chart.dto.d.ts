import { ToothCondition, ToothSurface, SurfaceCondition } from '@prisma/client';
declare class UpdateDentalSurfaceDto {
    surface: ToothSurface;
    condition: SurfaceCondition;
    notes?: string;
}
export declare class UpdateDentalChartDto {
    condition?: ToothCondition;
    notes?: string;
    surfaces?: UpdateDentalSurfaceDto[];
}
export {};
