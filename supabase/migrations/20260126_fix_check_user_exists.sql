CREATE OR REPLACE FUNCTION check_user_exists(email_arg text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  user_exists boolean;
BEGIN
  -- Check in auth.users instead of public.users to catch all registered accounts
  SELECT EXISTS (SELECT 1 FROM auth.users WHERE email = email_arg) INTO user_exists;
  RETURN user_exists;
END;
$$;
