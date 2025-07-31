-- Fix function search path security issues
CREATE OR REPLACE FUNCTION check_indicator_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.detection_indicators WHERE detection_id = NEW.detection_id) >= 50 THEN
    RAISE EXCEPTION 'Too many indicators for this detection';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;

CREATE OR REPLACE FUNCTION check_section_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.text_sections WHERE detection_id = NEW.detection_id) >= 100 THEN
    RAISE EXCEPTION 'Too many sections for this detection';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql
SET search_path = public;