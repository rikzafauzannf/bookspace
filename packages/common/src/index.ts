import { z } from 'zod';

export const RoleEnum = z.enum(['USER', 'ADMIN']);

export const BookStatusEnum = z.enum([
  'COLLECTION',
  'OPEN_TRADE',
  'AVAILABLE_FOR_RENT',
  'RENTED',
  'TRADED',
]);

export const TransactionTypeEnum = z.enum(['BORROW', 'TRADE']);

export const TransactionStatusEnum = z.enum([
  'REQUESTED',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'HANDED_OVER',
  'OVERDUE',
  'RETURNED',
  'DISPUTED',
  'COMPLETED',
]);

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  bio: z.string().max(500).optional().nullable(),
  cityId: z.string().optional().nullable(),
  districtId: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  trustScore: z.number().int().nonnegative().default(50),
  isVerified: z.boolean().default(false),
  role: RoleEnum.default('USER'),
  phoneNumber: z.string().optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
  createdAt: z.date().or(z.string()),
  updatedAt: z.date().or(z.string()),
});

export type User = z.infer<typeof UserSchema>;

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginInput = z.infer<typeof LoginSchema>;

export const RegisterSchema = LoginSchema.extend({
  fullName: z.string().min(2, 'Full name is required'),
});
export type RegisterInput = z.infer<typeof RegisterSchema>;

export const GoogleAuthSchema = z.object({
  idToken: z.string().min(1, 'Google ID token is required'),
});
export type GoogleAuthInput = z.infer<typeof GoogleAuthSchema>;

export const VerifyEmailSchema = z.object({
  token: z.string().min(1, 'Verification token is required'),
});
export type VerifyEmailInput = z.infer<typeof VerifyEmailSchema>;

export const ForgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});
export type ForgotPasswordInput = z.infer<typeof ForgotPasswordSchema>;

export const ResetPasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
});
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;

export const RefreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});
export type RefreshTokenInput = z.infer<typeof RefreshTokenSchema>;

export const UpdateProfileSchema = z.object({
  fullName: z.string().min(2).optional(),
  bio: z.string().max(500).optional().nullable(),
  cityId: z.string().optional().nullable(),
  districtId: z.string().optional().nullable(),
  latitude: z.number().optional().nullable(),
  longitude: z.number().optional().nullable(),
  phoneNumber: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,10}$/, 'Invalid Indonesian phone number format').optional().nullable(),
  avatarUrl: z.string().url().optional().nullable(),
});
export type UpdateProfileInput = z.infer<typeof UpdateProfileSchema>;

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface AuthResponse {
  user: Omit<User, 'createdAt' | 'updatedAt'> & { createdAt: string; updatedAt: string };
  tokens: AuthTokens;
}

// BOOK SCHEMAS
export const CreateBookSchema = z.object({
  isbn: z.string().optional().nullable(),
  title: z.string().min(1, 'Title is required'),
  author: z.string().min(1, 'Author is required'),
  publisher: z.string().optional().nullable(),
  publishedYear: z.number().int().optional().nullable(),
  description: z.string().optional().nullable(),
  condition: z.number().int().min(1).max(5),
  language: z.string().default('id'),
  genre: z.array(z.string()).default([]),
  images: z.array(z.string().url()).min(1, 'At least one image is required'),
  status: BookStatusEnum.default('COLLECTION'),

  allowRent: z.boolean().default(false),
  rentDurations: z.array(z.number().int()).default([7, 14, 30]),
  depositAmount: z.number().nonnegative().default(0),
  shippingPayer: z.enum(['borrower', 'owner', 'split']).default('borrower'),
  conditionRules: z.string().optional().nullable(),
});
export type CreateBookInput = z.infer<typeof CreateBookSchema>;

export const UpdateBookSchema = CreateBookSchema.partial();
export type UpdateBookInput = z.infer<typeof UpdateBookSchema>;

// TRANSACTION SCHEMAS
export const RequestBorrowSchema = z.object({
  bookId: z.string().uuid(),
  durationDays: z.number().int().positive(),
  depositAmount: z.number().nonnegative().optional(),
});
export type RequestBorrowInput = z.infer<typeof RequestBorrowSchema>;

export const RequestTradeSchema = z.object({
  bookId: z.string().uuid(),
  offeredBookId: z.string().uuid(),
});
export type RequestTradeInput = z.infer<typeof RequestTradeSchema>;

export const HandoverSchema = z.object({
  images: z.array(z.string().url()).min(1),
  notes: z.string().optional(),
});
export type HandoverInput = z.infer<typeof HandoverSchema>;

export const ReturnSchema = z.object({
  images: z.array(z.string().url()).min(1),
  notes: z.string().optional(),
});
export type ReturnInput = z.infer<typeof ReturnSchema>;

// CHAT & RATING SCHEMAS
export const SendMessageSchema = z.object({
  transactionId: z.string().uuid(),
  content: z.string().min(1),
});
export type SendMessageInput = z.infer<typeof SendMessageSchema>;

export const SubmitReviewSchema = z.object({
  transactionId: z.string().uuid(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});
export type SubmitReviewInput = z.infer<typeof SubmitReviewSchema>;

// SOCIAL & POST SCHEMAS
export const CreatePostSchema = z.object({
  content: z.string().min(1, 'Post content is required'),
  rating: z.number().int().min(1).max(5).optional().nullable(),
  bookId: z.string().uuid().optional().nullable(),
  images: z.array(z.string().url()).default([]),
});
export type CreatePostInput = z.infer<typeof CreatePostSchema>;

export const CreateCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty'),
});
export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

// WISHLIST SCHEMA
export const CreateWishlistSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  author: z.string().optional().nullable(),
  isbn: z.string().optional().nullable(),
  genre: z.string().optional().nullable(),
});
export type CreateWishlistInput = z.infer<typeof CreateWishlistSchema>;

// SEARCH & FILTER SCHEMA
export const SearchBooksQuerySchema = z.object({
  query: z.string().optional(),
  genre: z.string().optional(),
  status: BookStatusEnum.optional(),
  minCondition: z.coerce.number().min(1).max(5).optional(),
  cityId: z.string().optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  radiusKm: z.coerce.number().default(25),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20),
});
export type SearchBooksQuery = z.infer<typeof SearchBooksQuerySchema>;
