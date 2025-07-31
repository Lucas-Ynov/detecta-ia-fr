-- Remove the problematic complete_detections view that was flagged by security linter
DROP VIEW IF EXISTS public.complete_detections;

-- Add simple rate limiting constraints to prevent spam
ALTER TABLE public.ai_detections 
ADD CONSTRAINT reasonable_text_length CHECK (length(original_text) <= 50000);

-- Add reasonable limits using triggers instead of subquery constraints
CREATE OR REPLACE FUNCTION check_indicator_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.detection_indicators WHERE detection_id = NEW.detection_id) >= 50 THEN
    RAISE EXCEPTION 'Too many indicators for this detection';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_indicators
  BEFORE INSERT ON public.detection_indicators
  FOR EACH ROW
  EXECUTE FUNCTION check_indicator_limit();

CREATE OR REPLACE FUNCTION check_section_limit()
RETURNS TRIGGER AS $$
BEGIN
  IF (SELECT COUNT(*) FROM public.text_sections WHERE detection_id = NEW.detection_id) >= 100 THEN
    RAISE EXCEPTION 'Too many sections for this detection';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER limit_sections
  BEFORE INSERT ON public.text_sections
  FOR EACH ROW
  EXECUTE FUNCTION check_section_limit();