import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadarChart } from '@/components/RadarChart';
import { 
  Download, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Brain,
  Target,
  BarChart3,
  FileText,
  Clock
} from 'lucide-react';

interface AnalysisResultsProps {
  result: {
    id: string;
    aiProbability: number;
    suspectedAgent?: string;
    indicators: Array<{
      name: string;
      score: number;
      description: string;
      weight: number;
    }>;
    sections: Array<{
      text: string;
      startPosition: number;
      endPosition: number;
      suspicionLevel: 'low' | 'medium' | 'high';
      aiProbability: number;
      reasoning: string;
    }>;
    originalText: string;
    analysisType: 'quick' | 'advanced';
  };
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-red-600 bg-red-50 border-red-200';
    if (probability >= 40) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  const getProbabilityIcon = (probability: number) => {
    if (probability >= 70) return <XCircle className="h-5 w-5" />;
    if (probability >= 40) return <AlertTriangle className="h-5 w-5" />;
    return <CheckCircle className="h-5 w-5" />;
  };

  const getSuspicionLevelBadge = (level: 'low' | 'medium' | 'high') => {
    const variants = {
      low: 'bg-green-100 text-green-800 border-green-200',
      medium: 'bg-orange-100 text-orange-800 border-orange-200',
      high: 'bg-red-100 text-red-800 border-red-200'
    };
    const labels = {
      low: 'Faible',
      medium: 'Moyen',
      high: 'Élevé'
    };
    return (
      <Badge className={`${variants[level]} border`}>
        {labels[level]}
      </Badge>
    );
  };

  const downloadPDF = async () => {
    // Cette fonction sera implémentée avec jsPDF
    console.log('Téléchargement PDF...');
  };

  const highlightText = (text: string, sections: typeof result.sections) => {
    let highlightedText = text;
    const sortedSections = [...sections].sort((a, b) => b.startPosition - a.startPosition);
    
    sortedSections.forEach(section => {
      const colorClass = section.suspicionLevel === 'high' ? 'bg-red-200' : 
                        section.suspicionLevel === 'medium' ? 'bg-orange-200' : 'bg-yellow-200';
      
      const before = highlightedText.substring(0, section.startPosition);
      const highlighted = highlightedText.substring(section.startPosition, section.endPosition);
      const after = highlightedText.substring(section.endPosition);
      
      highlightedText = `${before}<span class="${colorClass} px-1 rounded" title="${section.reasoning}">${highlighted}</span>${after}`;
    });
    
    return highlightedText;
  };

  return (
    <div className="space-y-6">
      {/* Header avec score principal */}
      <Card className={`border-2 ${getProbabilityColor(result.aiProbability)}`}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              {getProbabilityIcon(result.aiProbability)}
              Résultat de l'analyse
            </CardTitle>
            <Badge variant="outline" className="text-xs">
              {result.analysisType === 'quick' ? 'Analyse Rapide' : 'Analyse Avancée'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                <span className="font-medium">Probabilité d'IA</span>
              </div>
              <div className="text-3xl font-bold">
                {result.aiProbability}%
              </div>
              <Progress value={result.aiProbability} className="h-2" />
            </div>
            
            {result.suspectedAgent && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  <span className="font-medium">Agent IA suspecté</span>
                </div>
                <div className="text-lg font-semibold">
                  {result.suspectedAgent}
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <span className="font-medium">Analysé le</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {new Date().toLocaleDateString('fr-FR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Détails de l'analyse */}
      <Tabs defaultValue="indicators" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="indicators">Indicateurs</TabsTrigger>
          <TabsTrigger value="sections">Analyse par sections</TabsTrigger>
          <TabsTrigger value="radar">Graphique radar</TabsTrigger>
          <TabsTrigger value="report">Rapport complet</TabsTrigger>
        </TabsList>

        <TabsContent value="indicators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Indicateurs détaillés
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {result.indicators.map((indicator, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{indicator.name}</span>
                      <span className="text-sm font-semibold">{indicator.score}%</span>
                    </div>
                    <Progress value={indicator.score} className="h-2" />
                    <p className="text-sm text-muted-foreground">
                      {indicator.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sections" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyse par sections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-4">
                  Les passages surlignés indiquent le niveau de suspicion d'utilisation d'IA
                </div>
                
                {/* Légende des couleurs */}
                <div className="flex gap-4 mb-6 p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-200 rounded"></div>
                    <span className="text-xs">Suspicion élevée</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-200 rounded"></div>
                    <span className="text-xs">Suspicion moyenne</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                    <span className="text-xs">Suspicion faible</span>
                  </div>
                </div>

                {/* Texte mis en évidence */}
                <div 
                  className="prose prose-sm max-w-none leading-relaxed p-4 bg-background border rounded-lg"
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(result.originalText, result.sections) 
                  }}
                />

                {/* Détails des sections suspectes */}
                <div className="space-y-3 mt-6">
                  <h4 className="font-medium">Sections analysées :</h4>
                  {result.sections.map((section, index) => (
                    <Card key={index} className="border-l-4 border-l-primary/20">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          {getSuspicionLevelBadge(section.suspicionLevel)}
                          <span className="text-sm font-medium">{section.aiProbability}% IA</span>
                        </div>
                        <p className="text-sm mb-2 font-mono bg-muted p-2 rounded">
                          "{section.text}"
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {section.reasoning}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="radar" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Graphique radar des indicateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart indicators={result.indicators} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Rapport complet
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Méthodologie d'analyse</h4>
                  <p className="text-sm text-muted-foreground">
                    L'analyse utilise plusieurs modèles de détection d'IA spécialisés pour le français, 
                    incluant l'analyse stylistique, la détection de patterns linguistiques, 
                    et la comparaison avec des bases de données de textes générés par IA.
                  </p>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-semibold">Fiabilité</h4>
                  <p className="text-sm text-muted-foreground">
                    Précision estimée : {result.analysisType === 'advanced' ? '94%' : '87%'} 
                    {' '}sur les textes français. Les résultats doivent être interprétés 
                    comme une aide à la décision, non comme une preuve définitive.
                  </p>
                </div>
              </div>

              <Button onClick={downloadPDF} className="w-full">
                <Download className="mr-2 h-4 w-4" />
                Télécharger le rapport PDF
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};