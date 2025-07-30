-- Corriger le problème de sécurité avec la vue
-- Supprimer l'ancienne vue et la recréer sans SECURITY DEFINER
DROP VIEW IF EXISTS public.complete_detections;

-- Recréer la vue sans propriété de sécurité spéciale
CREATE VIEW public.complete_detections AS
SELECT 
    ad.*,
    json_agg(DISTINCT jsonb_build_object(
        'id', di.id,
        'indicator_name', di.indicator_name,
        'score', di.score,
        'description', di.description,
        'weight', di.weight
    )) FILTER (WHERE di.id IS NOT NULL) AS indicators,
    json_agg(DISTINCT jsonb_build_object(
        'id', ts.id,
        'section_text', ts.section_text,
        'start_position', ts.start_position,
        'end_position', ts.end_position,
        'suspicion_level', ts.suspicion_level,
        'ai_probability', ts.ai_probability,
        'reasoning', ts.reasoning
    )) FILTER (WHERE ts.id IS NOT NULL) AS sections,
    json_agg(DISTINCT jsonb_build_object(
        'id', uf.id,
        'filename', uf.filename,
        'file_type', uf.file_type,
        'file_size', uf.file_size
    )) FILTER (WHERE uf.id IS NOT NULL) AS files
FROM public.ai_detections ad
LEFT JOIN public.detection_indicators di ON ad.id = di.detection_id
LEFT JOIN public.text_sections ts ON ad.id = ts.detection_id
LEFT JOIN public.uploaded_files uf ON ad.id = uf.detection_id
GROUP BY ad.id;