ALTER TABLE public.products ADD COLUMN IF NOT EXISTS gender TEXT CHECK (gender IN ('masculino', 'feminino', 'unisex')) DEFAULT NULL;
