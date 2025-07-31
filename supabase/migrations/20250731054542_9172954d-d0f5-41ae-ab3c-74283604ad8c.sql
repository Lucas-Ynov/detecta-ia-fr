-- Remove the problematic complete_detections view that was flagged by security linter
DROP VIEW IF EXISTS public.complete_detections;

-- Add rate limiting constraints to prevent spam
ALTER TABLE public.ai_detections 
ADD CONSTRAINT reasonable_text_length CHECK (length(original_text) <= 50000);

-- Add constraint to prevent excessive indicators per detection
ALTER TABLE public.detection_indicators 
ADD CONSTRAINT reasonable_indicator_count CHECK (
  (SELECT COUNT(*) FROM public.detection_indicators di WHERE di.detection_id = detection_id) <= 50
);

-- Add constraint to prevent excessive sections per detection  
ALTER TABLE public.text_sections
ADD CONSTRAINT reasonable_section_count CHECK (
  (SELECT COUNT(*) FROM public.text_sections ts WHERE ts.detection_id = detection_id) <= 100
);