// ... existing schemas ...

// PHASE 11: CLUBS, CHALLENGES, LISTS
export const CreateClubSchema = z.object({
  name: z.string().min(3),
  description: z.string().optional(),
  category: z.enum(['INTEREST', 'CITY']),
  cityId: z.string().optional().nullable(),
});

export const CreateDiscussionSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(1),
  isSpoiler: z.boolean().default(false),
});

export const SetChallengeSchema = z.object({
  targetCount: z.number().int().positive(),
  year: z.number().int(),
});
