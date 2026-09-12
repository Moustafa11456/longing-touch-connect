-- Revoke direct execution of trigger function from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;

-- Recreate partnerships with foreign keys to profiles so Supabase can infer relations
DROP TABLE IF EXISTS public.touches CASCADE;
DROP TABLE IF EXISTS public.partnerships CASCADE;

CREATE TABLE public.partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user1_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user2_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'accepted',
  created_at timestamptz DEFAULT now(),
  accepted_at timestamptz DEFAULT now(),
  UNIQUE (user1_id, user2_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnerships TO authenticated;
GRANT ALL ON public.partnerships TO service_role;

ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own partnerships"
  ON public.partnerships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can create partnerships"
  ON public.partnerships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can update own partnerships"
  ON public.partnerships
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id)
  WITH CHECK (auth.uid() = user1_id OR auth.uid() = user2_id);

CREATE POLICY "Users can delete own partnerships"
  ON public.partnerships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Recreate touches table referencing new partnerships table
CREATE TABLE public.touches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  partnership_id uuid NOT NULL REFERENCES public.partnerships(id) ON DELETE CASCADE,
  intensity integer NOT NULL DEFAULT 3,
  message text,
  sent_at timestamptz DEFAULT now(),
  received_at timestamptz,
  is_read boolean DEFAULT false
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.touches TO authenticated;
GRANT ALL ON public.touches TO service_role;

ALTER TABLE public.touches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own touches"
  ON public.touches
  FOR SELECT
  TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Users can send touches"
  ON public.touches
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can update received touches"
  ON public.touches
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = receiver_id)
  WITH CHECK (auth.uid() = receiver_id);

-- Re-enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.partnerships;
ALTER PUBLICATION supabase_realtime ADD TABLE public.touches;