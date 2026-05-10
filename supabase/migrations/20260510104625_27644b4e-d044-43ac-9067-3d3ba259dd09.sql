GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.product_images TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO anon, authenticated;