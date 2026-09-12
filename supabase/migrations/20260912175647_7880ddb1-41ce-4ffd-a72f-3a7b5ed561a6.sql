-- Secure the trigger function so it cannot be called directly via the API
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Verify and fix partnerships foreign keys to reference profiles
DO $$
BEGIN
  -- Drop existing FKs if they point to auth.users
  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'partnerships_user1_id_fkey'
      AND table_name = 'partnerships'
      AND constraint_type = 'FOREIGN KEY'
  ) THEN
    ALTER TABLE public.partnerships DROP CONSTRAINT partnerships_user1_id_fkey;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'partnerships_user2_id_fkey'
      AND table_name = 'partnerships'
      AND constraint_type = 'FOREIGN KEY'
  ) THEN
    ALTER TABLE public.partnerships DROP CONSTRAINT partnerships_user2_id_fkey;
  END IF;

  -- Add FKs to profiles
  ALTER TABLE public.partnerships
    ADD CONSTRAINT partnerships_user1_id_fkey FOREIGN KEY (user1_id) REFERENCES public.profiles(id) ON DELETE CASCADE,
    ADD CONSTRAINT partnerships_user2_id_fkey FOREIGN KEY (user2_id) REFERENCES public.profiles(id) ON DELETE CASCADE;
END
$$;