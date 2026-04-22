-- GWA-163: maintain leads.updated_at on UPDATE (INSERT keeps DEFAULT now())

CREATE OR REPLACE FUNCTION public.leads_touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_touch_updated_at ON public.leads;
CREATE TRIGGER leads_touch_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.leads_touch_updated_at();
