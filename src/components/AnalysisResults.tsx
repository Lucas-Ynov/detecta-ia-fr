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
import DOMPurify from 'dompurify';

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
    try {
      const { jsPDF } = await import('jspdf');
      const html2canvas = (await import('html2canvas')).default;
      
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      
      // === PAGE 1: HEADER ET RÉSULTATS PRINCIPAUX ===
      
      // Header avec logo (simulé par un cercle coloré)
      doc.setFillColor(59, 130, 246); // Couleur primary
      doc.circle(30, 25, 8, 'F');
      
      // Titre principal
      doc.setFontSize(24);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('DETECTA IA', 45, 20);
      
      doc.setFontSize(14);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(100, 100, 100);
      doc.text('Rapport d\'Analyse IA', 45, 28);
      
      // Ligne de séparation
      doc.setDrawColor(200, 200, 200);
      doc.line(20, 35, pageWidth - 20, 35);
      
      // Métadonnées
      doc.setFontSize(10);
      doc.setTextColor(80, 80, 80);
      doc.text(`Date: ${new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`, 20, 45);
      doc.text(`Type d'analyse: ${result.analysisType === 'advanced' ? 'Avancée' : 'Rapide'}`, 20, 52);
      
      // Résultat principal avec styling
      const probabilityColor = result.aiProbability >= 70 ? [220, 38, 127] : 
                              result.aiProbability >= 40 ? [245, 158, 11] : [34, 197, 94];
      
      // Boîte de résultat principal
      doc.setFillColor(249, 250, 251);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(20, 65, pageWidth - 40, 35, 3, 3, 'FD');
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('PROBABILITÉ IA', 25, 75);
      
      doc.setFontSize(32);
      doc.setTextColor(probabilityColor[0], probabilityColor[1], probabilityColor[2]);
      doc.text(`${result.aiProbability}%`, 25, 90);
      
      if (result.suspectedAgent) {
        doc.setFontSize(12);
        doc.setTextColor(100, 100, 100);
        doc.text(`Agent suspecté: ${result.suspectedAgent}`, 25, 97);
      }
      
      // === INDICATEURS DÉTAILLÉS ===
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('INDICATEURS D\'ANALYSE', 20, 120);
      
      let yPosition = 135;
      const maxIndicatorsPerPage = 6;
      
      result.indicators.slice(0, maxIndicatorsPerPage).forEach((indicator, index) => {
        // Barre de progression
        const barWidth = 120;
        const barHeight = 8;
        const xBar = 25;
        
        // Fond de la barre
        doc.setFillColor(229, 231, 235);
        doc.roundedRect(xBar, yPosition - 3, barWidth, barHeight, 2, 2, 'F');
        
        // Barre de progression
        const fillWidth = (indicator.score / 100) * barWidth;
        const indicatorColor = indicator.score >= 70 ? [220, 38, 127] : 
                              indicator.score >= 40 ? [245, 158, 11] : [34, 197, 94];
        doc.setFillColor(indicatorColor[0], indicatorColor[1], indicatorColor[2]);
        doc.roundedRect(xBar, yPosition - 3, fillWidth, barHeight, 2, 2, 'F');
        
        // Texte de l'indicateur
        doc.setFontSize(11);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(indicator.name, 25, yPosition - 8);
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(indicatorColor[0], indicatorColor[1], indicatorColor[2]);
        doc.text(`${indicator.score}%`, xBar + barWidth + 5, yPosition + 1);
        
        // Description
        doc.setFontSize(9);
        doc.setFont(undefined, 'normal');
        doc.setTextColor(100, 100, 100);
        const descLines = doc.splitTextToSize(indicator.description, 140);
        doc.text(descLines, 25, yPosition + 8);
        
        yPosition += 25;
      });
      
      // === PAGE 2: GRAPHIQUE RADAR ===
      doc.addPage();
      
      // Header de page
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('ANALYSE RADAR', 20, 20);
      
      // Capture du graphique radar
      try {
        const radarElement = document.querySelector('[data-testid="radar-chart"] svg') as SVGElement;
        if (radarElement) {
          // Convertir le SVG en image
          const svgData = new XMLSerializer().serializeToString(radarElement);
          const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
          const svgUrl = URL.createObjectURL(svgBlob);
          
          // Créer une image à partir du SVG
          const img = new Image();
          await new Promise((resolve, reject) => {
            img.onload = resolve;
            img.onerror = reject;
            img.src = svgUrl;
          });
          
          // Créer un canvas et dessiner l'image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = img.width;
          canvas.height = img.height;
          
          // Fond blanc
          ctx!.fillStyle = 'white';
          ctx!.fillRect(0, 0, canvas.width, canvas.height);
          
          // Dessiner l'image SVG
          ctx!.drawImage(img, 0, 0);
          
          const imgData = canvas.toDataURL('image/png', 1.0);
          const imgWidth = 150;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;
          
          doc.addImage(imgData, 'PNG', 30, 30, imgWidth, imgHeight);
          
          // Nettoyer
          URL.revokeObjectURL(svgUrl);
          
          // Ajouter le titre du graphique
          doc.setFontSize(12);
          doc.setTextColor(100, 100, 100);
          doc.text('Analyse radar des indicateurs de détection IA', 30, 30 + imgHeight + 15);
        } else {
          throw new Error('SVG du graphique radar non trouvé');
        }
      } catch (error) {
        console.error('Erreur capture radar:', error);
        
        // Fallback: créer un graphique radar simple avec du texte
        doc.setFontSize(14);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('GRAPHIQUE RADAR - Vue alternative', 30, 40);
        
        let yPos = 60;
        result.indicators.forEach((indicator, index) => {
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(60, 60, 60);
          doc.text(`${indicator.name}: ${indicator.score}%`, 30, yPos);
          
          // Barre visuelle simple
          const barWidth = 100;
          const fillWidth = (indicator.score / 100) * barWidth;
          doc.setDrawColor(200, 200, 200);
          doc.rect(30, yPos + 3, barWidth, 3);
          doc.setFillColor(59, 130, 246);
          doc.rect(30, yPos + 3, fillWidth, 3, 'F');
          
          yPos += 15;
        });
      }
      
      // === PAGE 3: SECTIONS SUSPECTES ===
      if (result.sections.length > 0) {
        doc.addPage();
        
        doc.setFontSize(16);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('SECTIONS SUSPECTES', 20, 20);
        
        yPosition = 35;
        result.sections.forEach((section, index) => {
          if (yPosition > 250) {
            doc.addPage();
            yPosition = 20;
          }
          
          // Badge niveau de suspicion
          const levelColors = {
            high: [220, 38, 127],
            medium: [245, 158, 11],
            low: [34, 197, 94]
          };
          
          const levelTexts = {
            high: 'ÉLEVÉ',
            medium: 'MOYEN', 
            low: 'FAIBLE'
          };
          
          const levelColor = levelColors[section.suspicionLevel];
          doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
          doc.roundedRect(20, yPosition - 5, 25, 8, 2, 2, 'F');
          
          doc.setFontSize(8);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(255, 255, 255);
          doc.text(levelTexts[section.suspicionLevel], 22, yPosition);
          
          // Probabilité
          doc.setFontSize(11);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(0, 0, 0);
          doc.text(`${section.aiProbability}%`, 50, yPosition);
          
          // Texte de la section
          doc.setFontSize(10);
          doc.setFont(undefined, 'normal');
          doc.setTextColor(60, 60, 60);
          const textLines = doc.splitTextToSize(`"${section.text}"`, 150);
          doc.text(textLines, 20, yPosition + 10);
          
          // Raison
          doc.setFontSize(9);
          doc.setFont(undefined, 'italic');
          doc.setTextColor(100, 100, 100);
          const reasonLines = doc.splitTextToSize(section.reasoning, 150);
          doc.text(reasonLines, 20, yPosition + 10 + (textLines.length * 4) + 5);
          
          yPosition += 25 + (textLines.length * 4) + (reasonLines.length * 3);
        });
      }
      
      // === PAGE FINALE: MÉTHODOLOGIE ===
      doc.addPage();
      
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.setTextColor(0, 0, 0);
      doc.text('MÉTHODOLOGIE', 20, 20);
      
      const methodology = [
        'Cette analyse utilise des algorithmes de détection linguistique avancés pour identifier',
        'les patterns typiques de génération automatique de texte.',
        '',
        'Les indicateurs analysés incluent :',
        '• Cohérence stylistique et variations linguistiques',
        '• Patterns de répétition et structures syntaxiques',
        '• Complexité lexicale et richesse vocabulaire',
        '• Marqueurs temporels et références contextuelles',
        '• Erreurs typiques des modèles de langage',
        '',
        'Ce rapport est généré automatiquement par Detecta IA.',
        `Analyse effectuée le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`
      ];
      
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      doc.setTextColor(80, 80, 80);
      
      yPosition = 35;
      methodology.forEach(line => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
        doc.text(line, 20, yPosition);
        yPosition += 7;
      });
      
      // Footer sur toutes les pages
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i}/${totalPages}`, pageWidth - 30, pageHeight - 10);
        doc.text('Detecta IA - Rapport d\'analyse', 20, pageHeight - 10);
      }
      
      // Téléchargement
      doc.save(`detecta-ia-rapport-${Date.now()}.pdf`);
    } catch (error) {
      console.error('Erreur lors de la génération du PDF:', error);
      alert('Erreur lors de la génération du rapport PDF');
    }
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
      
      // Escape the reasoning text to prevent XSS
      const safetitle = DOMPurify.sanitize(section.reasoning, { ALLOWED_TAGS: [] });
      highlightedText = `${before}<span class="${colorClass} px-1 rounded" title="${safetitle}">${highlighted}</span>${after}`;
    });
    
    // Sanitize the final HTML to prevent XSS attacks
    return DOMPurify.sanitize(highlightedText, {
      ALLOWED_TAGS: ['span'],
      ALLOWED_ATTR: ['class', 'title']
    });
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