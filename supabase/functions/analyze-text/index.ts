import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin'
};

// Configuration Supabase
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface AnalysisRequest {
  text: string;
  analysisType: 'quick' | 'advanced';
}

// Simulation d'une analyse IA avec des algorithmes réalistes
function analyzeText(text: string, analysisType: 'quick' | 'advanced') {
  const words = text.split(/\s+/);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Indicateurs de base pour l'analyse rapide
  const baseIndicators = [
    {
      name: "Longueur des phrases",
      score: calculateSentenceLengthScore(sentences),
      description: "Mesure la régularité de la longueur des phrases",
      weight: 1.2
    },
    {
      name: "Vocabulaire répétitif",
      score: calculateVocabularyRepetition(words),
      description: "Détecte l'usage répétitif de mots ou expressions",
      weight: 1.5
    },
    {
      name: "Transition entre idées",
      score: calculateTransitionScore(sentences),
      description: "Analyse la fluidité des transitions",
      weight: 1.3
    },
    {
      name: "Complexité syntaxique",
      score: calculateSyntaxComplexity(text),
      description: "Évalue la complexité des structures de phrases",
      weight: 1.4
    },
    {
      name: "Marqueurs temporels",
      score: calculateTemporalMarkers(text),
      description: "Détecte l'usage artificiel de marqueurs temporels",
      weight: 1.1
    },
    {
      name: "Cohérence lexicale",
      score: calculateLexicalCoherence(words),
      description: "Mesure la cohérence du vocabulaire utilisé",
      weight: 1.6
    },
    {
      name: "Patterns de ponctuation",
      score: calculatePunctuationPatterns(text),
      description: "Analyse les patterns de ponctuation",
      weight: 1.0
    },
    {
      name: "Structure argumentative",
      score: calculateArgumentativeStructure(sentences),
      description: "Évalue la structure des arguments",
      weight: 1.3
    }
  ];

  // Indicateurs avancés supplémentaires
  const advancedIndicators = analysisType === 'advanced' ? [
    {
      name: "Analyse stylistique",
      score: calculateStylisticAnalysis(text),
      description: "Détecte les patterns stylistiques d'IA",
      weight: 1.8
    },
    {
      name: "Métadonnées linguistiques",
      score: calculateLinguisticMetadata(text),
      description: "Analyse des métadonnées linguistiques",
      weight: 1.5
    },
    {
      name: "Émotions et subjectivité",
      score: calculateEmotionalAnalysis(text),
      description: "Détecte l'artificialité des émotions",
      weight: 1.4
    },
    {
      name: "Références culturelles",
      score: calculateCulturalReferences(text),
      description: "Analyse la pertinence des références",
      weight: 1.2
    },
    {
      name: "Originalité conceptuelle",
      score: calculateConceptualOriginality(text),
      description: "Mesure l'originalité des concepts",
      weight: 1.7
    },
    {
      name: "Cohérence temporelle",
      score: calculateTemporalCoherence(text),
      description: "Vérifie la cohérence temporelle",
      weight: 1.3
    },
    {
      name: "Spécificité du domaine",
      score: calculateDomainSpecificity(text),
      description: "Évalue la spécificité du vocabulaire",
      weight: 1.4
    }
  ] : [];

  const allIndicators = [...baseIndicators, ...advancedIndicators];
  
  // Calcul du score global pondéré
  const totalWeight = allIndicators.reduce((sum, ind) => sum + ind.weight, 0);
  const weightedScore = allIndicators.reduce((sum, ind) => sum + (ind.score * ind.weight), 0);
  const aiProbability = Math.round((weightedScore / totalWeight) * 100) / 100;

  // Détection de l'agent IA suspecté
  const suspectedAgent = detectAiAgent(allIndicators, text);

  // Analyse par sections
  const sections = analyzeSections(text, allIndicators);

  return {
    aiProbability: Math.min(100, Math.max(0, aiProbability)),
    suspectedAgent,
    indicators: allIndicators,
    sections,
    originalText: text,
    analysisType
  };
}

// Fonctions d'analyse spécialisées pour le français
function calculateSentenceLengthScore(sentences: string[]): number {
  if (sentences.length === 0) return 20;
  
  const lengths = sentences.map(s => s.trim().split(/\s+/).length);
  const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
  const variance = lengths.reduce((sum, len) => sum + Math.pow(len - avgLength, 2), 0) / lengths.length;
  
  // Les IA tendent à produire des phrases de longueur plus régulière
  const regularityScore = Math.max(0, 100 - (variance * 2));
  
  // Longueur moyenne suspecte (trop régulière autour de 15-25 mots)
  const lengthSuspicion = avgLength > 15 && avgLength < 25 ? 
    Math.min(60, Math.abs(20 - avgLength) * 3) : 0;
  
  return Math.min(100, regularityScore + lengthSuspicion);
}

function calculateVocabularyRepetition(words: string[]): number {
  const cleanWords = words.map(w => w.toLowerCase().replace(/[^\w]/g, ''));
  const wordCount = new Map<string, number>();
  
  cleanWords.forEach(word => {
    if (word.length > 3) { // Ignorer les mots très courts
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    }
  });
  
  const repetitions = Array.from(wordCount.values()).filter(count => count > 1);
  const repetitionRatio = repetitions.length / wordCount.size;
  
  // Les IA ont tendance à répéter certains termes
  return Math.min(100, repetitionRatio * 150);
}

function calculateTransitionScore(sentences: string[]): number {
  const frenchTransitions = [
    'cependant', 'néanmoins', 'toutefois', 'en outre', 'par ailleurs',
    'de plus', 'en effet', 'ainsi', 'par conséquent', 'donc',
    'en revanche', 'au contraire', 'malgré tout', 'bien que'
  ];
  
  let transitionCount = 0;
  let artificialPatterns = 0;
  
  sentences.forEach((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    const hasTransition = frenchTransitions.some(trans => lowerSentence.includes(trans));
    
    if (hasTransition) {
      transitionCount++;
      
      // Détection de patterns artificiels
      if (index > 0 && sentences[index - 1].toLowerCase().includes('ainsi')) {
        artificialPatterns++;
      }
    }
  });
  
  const transitionRatio = transitionCount / sentences.length;
  
  // Usage excessif ou patterns trop réguliers = suspect
  const excessiveUsage = transitionRatio > 0.4 ? (transitionRatio - 0.4) * 200 : 0;
  const patternSuspicion = artificialPatterns > 2 ? artificialPatterns * 15 : 0;
  
  return Math.min(100, excessiveUsage + patternSuspicion);
}

function calculateSyntaxComplexity(text: string): number {
  // Analyse de la complexité syntaxique en français
  const complexStructures = [
    /\b(qui|que|dont|où)\b.*\b(qui|que|dont|où)\b/gi, // Relatives multiples
    /\b(bien que|quoique|malgré que)\b/gi, // Subordonnées de concession
    /\b(afin que|pour que|de sorte que)\b/gi, // Subordonnées de but
    /\b(si.*alors|si.*,.*)/gi // Structures conditionnelles
  ];
  
  let complexityScore = 0;
  complexStructures.forEach(pattern => {
    const matches = text.match(pattern) || [];
    complexityScore += matches.length;
  });
  
  const sentences = text.split(/[.!?]+/).length;
  const complexityRatio = complexityScore / sentences;
  
  // Complexité artificielle : soit trop simple, soit trop complexe de façon régulière
  if (complexityRatio < 0.1) return 60; // Trop simple
  if (complexityRatio > 0.8) return 75; // Trop complexe
  
  return Math.min(100, complexityRatio * 40);
}

function calculateTemporalMarkers(text: string): number {
  const temporalMarkers = [
    'aujourd\'hui', 'actuellement', 'de nos jours', 'à l\'heure actuelle',
    'récemment', 'dernièrement', 'auparavant', 'jadis', 'autrefois'
  ];
  
  let markerCount = 0;
  temporalMarkers.forEach(marker => {
    const regex = new RegExp(marker, 'gi');
    const matches = text.match(regex) || [];
    markerCount += matches.length;
  });
  
  const sentences = text.split(/[.!?]+/).length;
  const markerRatio = markerCount / sentences;
  
  // Usage artificiel de marqueurs temporels
  return Math.min(100, markerRatio * 120);
}

function calculateLexicalCoherence(words: string[]): number {
  // Analyse de la cohérence lexicale (domaines sémantiques)
  const domains = {
    education: ['étudiant', 'école', 'université', 'cours', 'professeur', 'apprentissage'],
    technology: ['technologie', 'numérique', 'ordinateur', 'internet', 'logiciel'],
    society: ['société', 'social', 'communauté', 'culture', 'politique'],
    science: ['recherche', 'étude', 'analyse', 'méthode', 'résultat', 'données']
  };
  
  const wordSet = new Set(words.map(w => w.toLowerCase()));
  let domainScores: number[] = [];
  
  Object.values(domains).forEach(domainWords => {
    const overlap = domainWords.filter(word => wordSet.has(word)).length;
    domainScores.push(overlap / domainWords.length);
  });
  
  const maxDomainScore = Math.max(...domainScores);
  const coherenceScore = maxDomainScore * 100;
  
  // Cohérence artificielle trop parfaite
  return coherenceScore > 80 ? coherenceScore : Math.min(100, coherenceScore * 0.7);
}

function calculatePunctuationPatterns(text: string): number {
  const punctuationMarks = text.match(/[.!?;:,]/g) || [];
  const sentences = text.split(/[.!?]+/).length;
  
  if (sentences === 0) return 20;
  
  const avgPunctuationPerSentence = punctuationMarks.length / sentences;
  
  // Patterns de ponctuation trop réguliers
  const regularity = avgPunctuationPerSentence > 3 && avgPunctuationPerSentence < 6 ? 
    Math.abs(4.5 - avgPunctuationPerSentence) * 20 : 0;
  
  return Math.min(100, regularity);
}

function calculateArgumentativeStructure(sentences: string[]): number {
  const argumentativeMarkers = [
    'premièrement', 'deuxièmement', 'troisièmement', 'enfin',
    'd\'une part', 'd\'autre part', 'en premier lieu', 'en conclusion'
  ];
  
  let structureScore = 0;
  let sequentialCount = 0;
  
  sentences.forEach((sentence, index) => {
    const lowerSentence = sentence.toLowerCase();
    const hasMarker = argumentativeMarkers.some(marker => lowerSentence.includes(marker));
    
    if (hasMarker) {
      structureScore++;
      if (index > 0 && index < sentences.length - 1) {
        sequentialCount++;
      }
    }
  });
  
  const structureRatio = structureScore / sentences.length;
  
  // Structure trop formelle/artificielle
  return Math.min(100, structureRatio * 100 + (sequentialCount > 3 ? 30 : 0));
}

// Fonctions d'analyse avancée
function calculateStylisticAnalysis(text: string): number {
  // Analyse stylistique avancée
  const aiPatterns = [
    /\b(il est important de|il convient de|il faut noter que)\b/gi,
    /\b(en résumé|pour conclure|en définitive)\b/gi,
    /\b(par exemple|notamment|en particulier)\b.*\b(par exemple|notamment|en particulier)\b/gi
  ];
  
  let patternCount = 0;
  aiPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    patternCount += matches.length;
  });
  
  return Math.min(100, patternCount * 25);
}

function calculateLinguisticMetadata(text: string): number {
  // Métadonnées linguistiques
  const formalRegister = [
    'néanmoins', 'toutefois', 'cependant', 'par conséquent', 'en outre'
  ].filter(word => text.toLowerCase().includes(word)).length;
  
  const informalRegister = [
    'bon', 'alors', 'du coup', 'en fait', 'quand même'
  ].filter(word => text.toLowerCase().includes(word)).length;
  
  const registerImbalance = Math.abs(formalRegister - informalRegister);
  
  return Math.min(100, registerImbalance * 10);
}

function calculateEmotionalAnalysis(text: string): number {
  const emotionalWords = [
    'magnifique', 'extraordinaire', 'fantastique', 'merveilleux',
    'terrible', 'affreux', 'catastrophique', 'dramatique'
  ];
  
  let emotionalCount = 0;
  emotionalWords.forEach(word => {
    if (text.toLowerCase().includes(word)) {
      emotionalCount++;
    }
  });
  
  // Émotions artificielles
  return Math.min(100, emotionalCount * 20);
}

function calculateCulturalReferences(text: string): number {
  const frenchCulturalRefs = [
    'molière', 'voltaire', 'napoleon', 'révolution française', 'baguette'
  ];
  
  let refCount = 0;
  frenchCulturalRefs.forEach(ref => {
    if (text.toLowerCase().includes(ref)) {
      refCount++;
    }
  });
  
  // Références culturelles artificielles
  return refCount > 2 ? Math.min(100, refCount * 30) : 0;
}

function calculateConceptualOriginality(text: string): number {
  // Mesure l'originalité conceptuelle
  const commonConcepts = [
    'développement durable', 'intelligence artificielle', 'mondialisation',
    'changement climatique', 'société moderne'
  ];
  
  let commonCount = 0;
  commonConcepts.forEach(concept => {
    if (text.toLowerCase().includes(concept)) {
      commonCount++;
    }
  });
  
  return Math.min(100, commonCount * 25);
}

function calculateTemporalCoherence(text: string): number {
  // Cohérence temporelle
  const pastTense = (text.match(/\b\w+ait\b|\b\w+aient\b/g) || []).length;
  const presentTense = (text.match(/\b\w+e\b|\b\w+ent\b/g) || []).length;
  const futureTense = (text.match(/\b\w+era\b|\b\w+eront\b/g) || []).length;
  
  const totalVerbs = pastTense + presentTense + futureTense;
  if (totalVerbs === 0) return 20;
  
  const tenseVariation = [pastTense, presentTense, futureTense]
    .map(count => count / totalVerbs)
    .reduce((sum, ratio) => sum + Math.pow(ratio - 0.33, 2), 0);
  
  return Math.min(100, tenseVariation * 200);
}

function calculateDomainSpecificity(text: string): number {
  // Spécificité du domaine
  const generalWords = [
    'chose', 'important', 'problème', 'solution', 'exemple', 'situation'
  ];
  
  let generalCount = 0;
  generalWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    const matches = text.match(regex) || [];
    generalCount += matches.length;
  });
  
  const words = text.split(/\s+/).length;
  const generalRatio = generalCount / words;
  
  return Math.min(100, generalRatio * 300);
}

function detectAiAgent(indicators: any[], text: string): string | undefined {
  const highScores = indicators.filter(ind => ind.score > 70);
  
  if (highScores.length >= 3) {
    // Logique de détection basée sur les patterns
    if (indicators.find(ind => ind.name === 'Structure argumentative' && ind.score > 80)) {
      return 'ChatGPT/GPT-4';
    }
    if (indicators.find(ind => ind.name === 'Analyse stylistique' && ind.score > 75)) {
      return 'Claude/Gemini';
    }
    if (indicators.find(ind => ind.name === 'Vocabulaire répétitif' && ind.score > 70)) {
      return 'Modèle générique';
    }
  }
  
  return undefined;
}

function analyzeSections(text: string, indicators: any[]) {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sections = [];
  
  let currentPosition = 0;
  
  sentences.forEach((sentence, index) => {
    const trimmedSentence = sentence.trim();
    if (trimmedSentence.length === 0) return;
    
    const startPos = text.indexOf(trimmedSentence, currentPosition);
    const endPos = startPos + trimmedSentence.length;
    
    // Analyse de suspicion pour cette phrase
    let suspicionScore = 0;
    let reasoning = [];
    
    // Vérification des patterns IA
    if (trimmedSentence.toLowerCase().includes('il est important de')) {
      suspicionScore += 30;
      reasoning.push('Expression typique d\'IA');
    }
    
    if (trimmedSentence.split(/\s+/).length > 25) {
      suspicionScore += 20;
      reasoning.push('Phrase anormalement longue');
    }
    
    if (/^(premièrement|deuxièmement|enfin)/i.test(trimmedSentence)) {
      suspicionScore += 25;
      reasoning.push('Structure artificielle');
    }
    
    const suspicionLevel = suspicionScore > 50 ? 'high' : 
                          suspicionScore > 25 ? 'medium' : 'low';
    
    if (suspicionScore > 15) { // Seulement les phrases suspectes
      sections.push({
        text: trimmedSentence,
        startPosition: startPos,
        endPosition: endPos,
        suspicionLevel,
        aiProbability: Math.min(100, suspicionScore),
        reasoning: reasoning.join(', ') || 'Analyse contextuelle'
      });
    }
    
    currentPosition = endPos;
  });
  
  return sections;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, analysisType }: AnalysisRequest = await req.json();

    // Enhanced input validation
    if (!text || typeof text !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Le texte est requis et doit être une chaîne de caractères' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (text.trim().length < 10) {
      return new Response(
        JSON.stringify({ error: 'Le texte doit contenir au moins 10 caractères' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (text.length > 50000) {
      return new Response(
        JSON.stringify({ error: 'Le texte ne peut pas dépasser 50 000 caractères' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    if (!analysisType || !['quick', 'advanced'].includes(analysisType)) {
      return new Response(
        JSON.stringify({ error: 'Type d\'analyse invalide' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log(`Analyse ${analysisType} d'un texte de ${text.length} caractères`);

    // Simulation d'un délai d'analyse
    await new Promise(resolve => setTimeout(resolve, analysisType === 'advanced' ? 2000 : 1000));

    const analysisResult = analyzeText(text, analysisType);

    // Sauvegarder en base de données
    const { data: detection, error: detectionError } = await supabase
      .from('ai_detections')
      .insert({
        original_text: text,
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
      const sectionsData = analysisResult.sections.map(section => ({
        detection_id: detection.id,
        section_text: section.text,
        start_position: section.startPosition,
        end_position: section.endPosition,
        suspicion_level: section.suspicionLevel,
        ai_probability: section.aiProbability,
        reasoning: section.reasoning
      }));

      if (sectionsData.length > 0) {
        await supabase.from('text_sections').insert(sectionsData);
      }

      analysisResult.id = detection.id;
    }

    return new Response(
      JSON.stringify(analysisResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erreur dans analyze-text:', error);
    return new Response(
      JSON.stringify({ error: 'Erreur interne du serveur' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});