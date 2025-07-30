-- Créer la table pour stocker les analyses de détection d'IA
CREATE TABLE public.ai_detections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    original_text TEXT NOT NULL,
    analysis_type TEXT NOT NULL CHECK (analysis_type IN ('quick', 'advanced')),
    ai_probability DECIMAL(5,2) NOT NULL CHECK (ai_probability >= 0 AND ai_probability <= 100),
    suspected_ai_agent TEXT,
    overall_score DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Créer la table pour les indicateurs détaillés
CREATE TABLE public.detection_indicators (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    detection_id UUID NOT NULL REFERENCES public.ai_detections(id) ON DELETE CASCADE,
    indicator_name TEXT NOT NULL,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    description TEXT,
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.0
);

-- Créer la table pour l'analyse par sections
CREATE TABLE public.text_sections (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    detection_id UUID NOT NULL REFERENCES public.ai_detections(id) ON DELETE CASCADE,
    section_text TEXT NOT NULL,
    start_position INTEGER NOT NULL,
    end_position INTEGER NOT NULL,
    suspicion_level TEXT NOT NULL CHECK (suspicion_level IN ('low', 'medium', 'high')),
    ai_probability DECIMAL(5,2) NOT NULL,
    reasoning TEXT
);

-- Créer la table pour stocker les fichiers uploadés
CREATE TABLE public.uploaded_files (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    detection_id UUID NOT NULL REFERENCES public.ai_detections(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    extracted_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Activer RLS sur toutes les tables (données publiques mais contrôlées)
ALTER TABLE public.ai_detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.detection_indicators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.text_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- Créer des politiques pour permettre l'accès public en lecture et création
CREATE POLICY "Public can create ai_detections" 
ON public.ai_detections 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can read ai_detections" 
ON public.ai_detections 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public can create detection_indicators" 
ON public.detection_indicators 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can read detection_indicators" 
ON public.detection_indicators 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public can create text_sections" 
ON public.text_sections 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can read text_sections" 
ON public.text_sections 
FOR SELECT 
TO public
USING (true);

CREATE POLICY "Public can create uploaded_files" 
ON public.uploaded_files 
FOR INSERT 
TO public
WITH CHECK (true);

CREATE POLICY "Public can read uploaded_files" 
ON public.uploaded_files 
FOR SELECT 
TO public
USING (true);

-- Créer des index pour améliorer les performances
CREATE INDEX idx_detection_indicators_detection_id ON public.detection_indicators(detection_id);
CREATE INDEX idx_text_sections_detection_id ON public.text_sections(detection_id);
CREATE INDEX idx_uploaded_files_detection_id ON public.uploaded_files(detection_id);
CREATE INDEX idx_ai_detections_created_at ON public.ai_detections(created_at);

-- Créer une vue pour faciliter la récupération des données complètes
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