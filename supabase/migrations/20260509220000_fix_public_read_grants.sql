-- Garante que o papel anon pode ler as tabelas públicas
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.categories TO anon;
GRANT SELECT ON public.product_images TO anon;

-- Garante que as políticas de leitura pública existem
-- (usa DROP IF EXISTS para evitar erro se já existirem)

-- Products
DROP POLICY IF EXISTS "Active products viewable by everyone" ON public.products;
CREATE POLICY "Active products viewable by everyone" ON public.products
  FOR SELECT USING (active = true);

-- Categories
DROP POLICY IF EXISTS "Categories viewable by everyone" ON public.categories;
CREATE POLICY "Categories viewable by everyone" ON public.categories
  FOR SELECT USING (true);

-- Product images
DROP POLICY IF EXISTS "Product images viewable by everyone" ON public.product_images;
CREATE POLICY "Product images viewable by everyone" ON public.product_images
  FOR SELECT USING (true);
