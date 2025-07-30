import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Send, Zap, TrendingUp } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface TextAnalyzerProps {
  onAnalysisComplete: (result: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const TextAnalyzer = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: TextAnalyzerProps) => {
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState<'quick' | 'advanced'>('quick');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!text.trim()) {
      toast({
        title: "Erreur",
        description: "Veuillez saisir un texte à analyser",
        variant: "destructive",
      });
      return;
    }

    if (text.length < 50) {
      toast({
        title: "Texte trop court",
        description: "Le texte doit contenir au moins 50 caractères pour une analyse fiable",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke('analyze-text', {
        body: {
          text: text.trim(),
          analysisType,
        },
      });

      if (error) throw error;

      onAnalysisComplete(data);
      
      toast({
        title: "Analyse terminée",
        description: `Probabilité d'IA détectée: ${data.aiProbability}%`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'analyse:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse du texte",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label htmlFor="text-input" className="text-base font-medium">
          Collez votre texte ici
        </Label>
        <Textarea
          id="text-input"
          placeholder="Collez le texte à analyser ici... (minimum 50 caractères)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[200px] resize-none"
          disabled={isAnalyzing}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{text.length} caractères</span>
          <span>{text.split(/\s+/).filter(word => word.length > 0).length} mots</span>
        </div>
      </div>

      <Card className="border-primary/20">
        <CardContent className="p-4">
          <Label className="text-base font-medium mb-3 block">
            Type d'analyse
          </Label>
          <RadioGroup
            value={analysisType}
            onValueChange={(value) => setAnalysisType(value as 'quick' | 'advanced')}
            className="space-y-3"
            disabled={isAnalyzing}
          >
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
              <RadioGroupItem value="quick" id="quick" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="quick" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="h-4 w-4 text-primary" />
                  Analyse Rapide
                </Label>
                <p className="text-sm text-muted-foreground">
                  Analyse de base avec 8 indicateurs principaux. Résultats en ~10 secondes.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
              <RadioGroupItem value="advanced" id="advanced" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="advanced" className="flex items-center gap-2 cursor-pointer">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Analyse Avancée
                </Label>
                <p className="text-sm text-muted-foreground">
                  Analyse complète avec 15+ indicateurs, analyse stylistique et détection d'agent IA. Résultats en ~30 secondes.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || !text.trim() || text.length < 50}
        className="w-full h-12 text-base"
        size="lg"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <Send className="mr-2 h-5 w-5" />
            Analyser le texte
          </>
        )}
      </Button>
    </div>
  );
};