import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Supabase client untuk Next.js App Router
export const createClient = () => {
  return createClientComponentClient();
};
