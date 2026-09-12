
CREATE OR REPLACE FUNCTION public.find_profile_id_by_email(_email text)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE lower(email) = lower(trim(_email)) LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION public.find_profile_id_by_email(text) TO authenticated;

CREATE POLICY "Partners can read each other profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.partnerships p
    WHERE p.status = 'accepted'
      AND ((p.user1_id = auth.uid() AND p.user2_id = profiles.id)
        OR (p.user2_id = auth.uid() AND p.user1_id = profiles.id))
  )
);
