import { z } from "zod";
export declare const noteIdSchema: z.ZodString;
export declare const noteSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodDefault<z.ZodString>;
    content: z.ZodDefault<z.ZodString>;
    updatedAt: z.ZodISODateTime;
    version: z.ZodNumber;
}, z.core.$strip>;
//# sourceMappingURL=noteSchema.d.ts.map