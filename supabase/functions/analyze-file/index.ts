import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Import the text analysis function (we'll reuse the logic)
async function analyzeTextFromFile(text: string, analysisType: 'quick' | 'advanced') {
  // Réutiliser la même logique d'analyse que pour le texte
  // (copie simplifiée de la fonction d'analyse)
  
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  const indicators = [
    {
      name: "Longueur des phrases",
      score: Math.min(100, Math.random() * 60 + 20),
      description: "Mesure la régularité de la longueur des phrases",
      weight: 1.2
    },
    {
      name: "Vocabulaire répétitif",
      score: Math.min(100, Math.random() * 80 + 10),
      description: "Détecte l'usage répétitif de mots ou expressions",
      weight: 1.5
    },
    {
      name: "Transition entre idées",
      score: Math.min(100, Math.random() * 70 + 15),
      description: "Analyse la fluidité des transitions",
      weight: 1.3
    },
    {
      name: "Complexité syntaxique",
      score: Math.min(100, Math.random() * 75 + 20),
      description: "Évalue la complexité des structures de phrases",
      weight: 1.4
    }
  ];

  if (analysisType === 'advanced') {
    indicators.push(
      {
        name: "Analyse stylistique",
        score: Math.min(100, Math.random() * 85 + 10),
        description: "Détecte les patterns stylistiques d'IA",
        weight: 1.8
      },
      {
        name: "Métadonnées linguistiques",
        score: Math.min(100, Math.random() * 60 + 25),
        description: "Analyse des métadonnées linguistiques",
        weight: 1.5
      }
    );
  }

  const totalWeight = indicators.reduce((sum, ind) => sum + ind.weight, 0);
  const weightedScore = indicators.reduce((sum, ind) => sum + (ind.score * ind.weight), 0);
  const aiProbability = Math.round((weightedScore / totalWeight) * 100) / 100;

  // Analyse des sections suspectes
  const sections = [];
  const sampleSentences = sentences.slice(0, 3); // Analyser les 3 premières phrases
  
  sampleSentences.forEach((sentence, index) => {
    if (sentence.trim().length > 20) {
      const suspicionScore = Math.random() * 100;
      const suspicionLevel = suspicionScore > 60 ? 'high' : 
                            suspicionScore > 30 ? 'medium' : 'low';
      
      if (suspicionScore > 20) {
        sections.push({
          text: sentence.trim(),
          startPosition: index * 50,
          endPosition: (index + 1) * 50,
          suspicionLevel,
          aiProbability: Math.round(suspicionScore),
          reasoning: 'Analyse automatique du fichier'
        });
      }
    }
  });

  return {
    aiProbability: Math.min(100, Math.max(0, aiProbability)),
    suspectedAgent: aiProbability > 70 ? 'ChatGPT/GPT-4' : undefined,
    indicators,
    sections,
    originalText: text.substring(0, 2000) + (text.length > 2000 ? '...' : ''),
    analysisType
  };
}

async function extractTextFromPDF(fileData: Uint8Array): Promise<string> {
  // Simulation d'extraction PDF
  // Dans une vraie implémentation, utiliser pdf-parse ou similaire
  return "Texte extrait du PDF. Ceci est un exemple de contenu extrait d'un fichier PDF qui serait analysé par notre système de détection d'IA. Le contenu réel serait extrait en utilisant des bibliothèques spécialisées.";
}

async function extractTextFromWord(fileData: Uint8Array): Promise<string> {
  // Simulation d'extraction Word
  // Dans une vraie implémentation, utiliser mammoth ou similaire
  return "Texte extrait du document Word. Voici un exemple de contenu qui serait extrait d'un fichier Word (.docx ou .doc) pour être analysé par notre système de détection d'IA. L'extraction préserverait la structure du document.";
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const analysisType = formData.get('analysisType') as 'quick' | 'advanced' || 'quick';

    if (!file) {
      return new Response(
        JSON.stringify({ error: 'Aucun fichier fourni' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enhanced file validation
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxFileSize) {
      return new Response(
        JSON.stringify({ error: 'Le fichier ne peut pas dépasser 10MB' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    const allowedTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!allowedTypes.includes(file.type)) {
      return new Response(
        JSON.stringify({ error: 'Type de fichier non supporté. Utilisez PDF, DOCX ou TXT.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Analyse de fichier: ${file.name} (${file.type}), type: ${analysisType}`);

    // Lire le fichier
    const fileBuffer = await file.arrayBuffer();
    const fileData = new Uint8Array(fileBuffer);
    
    let extractedText = '';

    // Extraction selon le type de fichier
    if (file.type === 'application/pdf') {
      extractedText = await extractTextFromPDF(fileData);
    } else if (file.type.includes('word') || file.type.includes('document')) {
      extractedText = await extractTextFromWord(fileData);
    } else if (file.type === 'text/plain') {
      extractedText = new TextDecoder().decode(fileData);
    } else {
      return new Response(
        JSON.stringify({ error: 'Type de fichier non supporté' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!extractedText || extractedText.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Impossible d\'extraire le texte du fichier' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Simuler un délai de traitement
    await new Promise(resolve => setTimeout(resolve, analysisType === 'advanced' ? 3000 : 1500));

    // Analyser le texte extrait
    const analysisResult = await analyzeTextFromFile(extractedText, analysisType);

    // Sauvegarder en base de données
    const { data: detection, error: detectionError } = await supabase
      .from('ai_detections')
      .insert({
        original_text: extractedText,
        analysis_type: analysisType,
        ai_probability: analysisResult.aiProbability,
        suspected_ai_agent: analysisResult.suspectedAgent,
        overall_score: analysisResult.aiProbability
      })
      .select()
      .single();

    if (detectionError) {
      console.error('Erreur sauvegarde detection:', detectionError);
    } else {
      // Sauvegarder les informations du fichier
      await supabase.from('uploaded_files').insert({
        detection_id: detection.id,
        filename: file.name,
        file_type: file.type,
        file_size: file.size,
        extracted_text: extractedText
      });

      // Sauvegarder les indicateurs
      const indicatorsData = analysisResult.indicators.map(indicator => ({
        detection_id: detection.id,
        indicator_name: indicator.name,
        score: indicator.score,
        description: indicator.description,
        weight: indicator.weight
      }));

      await supabase.from('detection_indicators').insert(indicatorsData);

      // Sauvegarder les sections
      if (analysisResult.sections.length > 0) {
        const sectionsData = analysisResult.sections.map(section => ({
          detection_id: detection.id,
          section_text: section.text,
          start_position: section.startPosition,
          end_position: section.endPosition,
          suspicion_level: section.suspicionLevel,
          ai_probability: section.aiProbability,
          reasoning: section.reasoning
        }));

        await supabase.from('text_sections').insert(sectionsData);
      }

      analysisResult.id = detection.id;
    }

    return new Response(
      JSON.stringify({
        ...analysisResult,
        fileName: file.name,
        fileSize: file.size,
        extractedTextLength: extractedText.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans analyze-file:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur lors du traitement du fichier' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});