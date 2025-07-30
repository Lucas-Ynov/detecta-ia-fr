import { useState } from 'react';
import { TextAnalyzer } from '@/components/TextAnalyzer';
import { FileUploader } from '@/components/FileUploader';
import { AnalysisResults } from '@/components/AnalysisResults';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Brain, FileText, Zap, TrendingUp } from 'lucide-react';

interface AnalysisResult {
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
}

const Index = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Brain className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              IA Detector
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Outil de détection d'utilisation de l'IA pour les travaux d'étudiants
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Spécialisé pour les textes en langue française • Fiable • Sans inscription
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 text-center">
              <Zap className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Analyse Rapide</h3>
              <p className="text-sm text-muted-foreground">Résultats en quelques secondes</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Analyse Avancée</h3>
              <p className="text-sm text-muted-foreground">Analyse approfondie et détaillée</p>
            </CardContent>
          </Card>
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardContent className="p-4 text-center">
              <FileText className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Multi-format</h3>
              <p className="text-sm text-muted-foreground">Texte, PDF, Word</p>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Section */}
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Analyser un texte
                <Badge variant="secondary" className="ml-auto">
                  Français
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="text" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text">Coller du texte</TabsTrigger>
                  <TabsTrigger value="file">Uploader un fichier</TabsTrigger>
                </TabsList>
                
                <TabsContent value="text" className="space-y-4">
                  <TextAnalyzer 
                    onAnalysisComplete={setAnalysisResult}
                    isAnalyzing={isAnalyzing}
                    setIsAnalyzing={setIsAnalyzing}
                  />
                </TabsContent>
                
                <TabsContent value="file" className="space-y-4">
                  <FileUploader 
                    onAnalysisComplete={setAnalysisResult}
                    isAnalyzing={isAnalyzing}
                    setIsAnalyzing={setIsAnalyzing}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Results */}
          {analysisResult && (
            <div className="mt-8">
              <AnalysisResults result={analysisResult} />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-16 py-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            IA Detector V2 • Fiable • Précis • Spécialisé pour le français
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
