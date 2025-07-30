import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  File, 
  X, 
  Loader2, 
  Send, 
  Zap, 
  TrendingUp,
  AlertCircle 
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface FileUploaderProps {
  onAnalysisComplete: (result: any) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
}

export const FileUploader = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: FileUploaderProps) => {
  const [files, setFiles] = useState<File[]>([]);
  const [analysisType, setAnalysisType] = useState<'quick' | 'advanced'>('quick');
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const isValidType = file.type === 'application/pdf' || 
                         file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                         file.type === 'application/msword' ||
                         file.type === 'text/plain';
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max

      if (!isValidType) {
        toast({
          title: "Format non supporté",
          description: `Le fichier "${file.name}" n'est pas au format PDF, Word ou TXT`,
          variant: "destructive",
        });
      }

      if (!isValidSize) {
        toast({
          title: "Fichier trop volumineux",
          description: `Le fichier "${file.name}" dépasse la limite de 10MB`,
          variant: "destructive",
        });
      }

      return isValidType && isValidSize;
    });

    setFiles(validFiles);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxFiles: 1,
    disabled: isAnalyzing
  });

  const removeFile = (fileToRemove: File) => {
    setFiles(files.filter(file => file !== fileToRemove));
  };

  const getFileIcon = (file: File) => {
    if (file.type === 'application/pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    }
    if (file.type.includes('word')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    }
    return <File className="h-8 w-8 text-gray-500" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleAnalyze = async () => {
    if (files.length === 0) {
      toast({
        title: "Aucun fichier",
        description: "Veuillez sélectionner un fichier à analyser",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    setUploadProgress(0);

    try {
      const file = files[0];
      
      // Simuler le progrès d'upload
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('analysisType', analysisType);

      const { data, error } = await supabase.functions.invoke('analyze-file', {
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (error) throw error;

      onAnalysisComplete(data);
      
      toast({
        title: "Analyse terminée",
        description: `Fichier "${file.name}" analysé avec succès`,
      });
    } catch (error) {
      console.error('Erreur lors de l\'analyse du fichier:', error);
      toast({
        title: "Erreur d'analyse",
        description: "Une erreur est survenue lors de l'analyse du fichier",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-primary bg-primary/5' 
            : 'border-border hover:border-primary/50'
          }
          ${isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        {isDragActive ? (
          <p className="text-lg font-medium text-primary">
            Déposez le fichier ici...
          </p>
        ) : (
          <div className="space-y-2">
            <p className="text-lg font-medium">
              Glissez-déposez un fichier ici, ou cliquez pour sélectionner
            </p>
            <p className="text-sm text-muted-foreground">
              Formats supportés: PDF, Word (.docx, .doc), TXT • Taille max: 10MB
            </p>
          </div>
        )}
      </div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-4">
          <Label className="text-base font-medium">Fichier sélectionné</Label>
          {files.map((file, index) => (
            <Card key={index} className="border-primary/20">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  {getFileIcon(file)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file)}
                    disabled={isAnalyzing}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Progress */}
      {isAnalyzing && uploadProgress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Traitement du fichier...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      {/* Analysis Type Selection */}
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
              <RadioGroupItem value="quick" id="file-quick" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="file-quick" className="flex items-center gap-2 cursor-pointer">
                  <Zap className="h-4 w-4 text-primary" />
                  Analyse Rapide
                </Label>
                <p className="text-sm text-muted-foreground">
                  Extraction de texte et analyse de base. Plus rapide pour les gros fichiers.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border hover:border-primary/40 transition-colors">
              <RadioGroupItem value="advanced" id="file-advanced" className="mt-1" />
              <div className="space-y-1 flex-1">
                <Label htmlFor="file-advanced" className="flex items-center gap-2 cursor-pointer">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Analyse Avancée
                </Label>
                <p className="text-sm text-muted-foreground">
                  Analyse complète avec préservation de la structure et métadonnées.
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Warning for large files */}
      {files.some(file => file.size > 5 * 1024 * 1024) && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-orange-700">
                  Fichier volumineux détecté
                </p>
                <p className="text-xs text-orange-600">
                  L'analyse de fichiers supérieurs à 5MB peut prendre plus de temps. 
                  Considérez utiliser l'analyse rapide pour de meilleures performances.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Button
        onClick={handleAnalyze}
        disabled={isAnalyzing || files.length === 0}
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
            Analyser le fichier
          </>
        )}
      </Button>
    </div>
  );
};