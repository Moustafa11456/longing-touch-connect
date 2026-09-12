
REVOKE EXECUTE ON FUNCTION public.find_profile_id_by_email(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.find_profile_id_by_email(text) TO authenticated;
