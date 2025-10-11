import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Upload, FileText, Database, Video, Music, FileSpreadsheet } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Admin = () => {
  const [file, setFile] = useState<File | null>(null);
  const [textData, setTextData] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadType, setUploadType] = useState("training"); // training, multimedia
  const { toast } = useToast();

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      let endpoint = "upload-training-data";
      if (uploadType === "multimedia") {
        endpoint = "process-multimedia";
      }

      const { data, error } = await supabase.functions.invoke(endpoint, {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Upload successful",
        description: uploadType === "multimedia" 
          ? "Multimedia file processed successfully" 
          : "Training data has been added to the system",
      });
      
      setFile(null);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleTextUpload = async () => {
    if (!textData.trim()) {
      toast({
        title: "No text provided",
        description: "Please enter text data to upload",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data, error } = await supabase.functions.invoke("upload-training-data", {
        body: { text: textData },
      });

      if (error) throw error;

      toast({
        title: "Text data uploaded",
        description: "Training data has been added successfully",
      });
      
      setTextData("");
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload failed",
        description: "Could not upload text data",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    
    if (['mp4', 'avi', 'mov', 'mkv', 'wmv', 'flv', 'webm'].includes(ext || '')) {
      return <Video className="h-4 w-4 text-red-500" />;
    } else if (['mp3', 'wav', 'flac', 'aac', 'ogg', 'm4a'].includes(ext || '')) {
      return <Music className="h-4 w-4 text-blue-500" />;
    } else if (['csv', 'xlsx', 'xls'].includes(ext || '')) {
      return <FileSpreadsheet className="h-4 w-4 text-green-500" />;
    } else {
      return <FileText className="h-4 w-4 text-primary" />;
    }
  };

  const getSupportedFormats = () => {
    if (uploadType === "multimedia") {
      return "Video: MP4, AVI, MOV, MKV, WMV, FLV, WebM | Audio: MP3, WAV, FLAC, AAC, OGG, M4A | Documents: TXT, PDF, DOC, DOCX | Spreadsheets: CSV, XLSX, XLS";
    }
    return "Training: TXT, CSV, Excel";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <div className="container max-w-5xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Admin Panel</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload training data and multimedia files to improve translation accuracy
          </p>
        </div>

        {/* Upload Type Selector */}
        <Card className="p-6 bg-card/50 backdrop-blur-sm mb-8">
          <div className="flex items-center gap-4">
            <Label htmlFor="upload-type">Upload Type:</Label>
            <select
              id="upload-type"
              value={uploadType}
              onChange={(e) => setUploadType(e.target.value)}
              className="px-3 py-2 border rounded-md bg-background"
            >
              <option value="training">Training Data</option>
              <option value="multimedia">Multimedia Processing</option>
            </select>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {uploadType === "multimedia" 
              ? "Process videos, music, and documents to extract training data"
              : "Upload translation pairs for model training"
            }
          </p>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* File Upload */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Upload className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-bold">
                {uploadType === "multimedia" ? "Upload Multimedia Files" : "Upload Files"}
              </h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="file-upload">Select File</Label>
                <Input
                  id="file-upload"
                  type="file"
                  accept={uploadType === "multimedia" 
                    ? ".mp4,.avi,.mov,.mkv,.wmv,.flv,.webm,.mp3,.wav,.flac,.aac,.ogg,.m4a,.txt,.pdf,.doc,.docx,.csv,.xlsx,.xls"
                    : ".txt,.csv,.xlsx,.xls"
                  }
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: {getSupportedFormats()}
                </p>
              </div>

              {file && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getFileIcon(file.name)}
                    <span className="text-sm font-medium">{file.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              )}

              <Button
                onClick={handleFileUpload}
                disabled={!file || isUploading}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {isUploading ? "Processing..." : `Upload ${uploadType === "multimedia" ? "Multimedia" : "File"}`}
              </Button>
            </div>
          </Card>

          {/* Text Upload */}
          <Card className="p-6 bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <Database className="h-6 w-6 text-accent" />
              <h2 className="text-xl font-bold">Add Text Data</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="text-data">Training Text</Label>
                <Textarea
                  id="text-data"
                  value={textData}
                  onChange={(e) => setTextData(e.target.value)}
                  placeholder="Enter English-Hausa translation pairs..."
                  className="min-h-[200px] mt-2"
                />
                <p className="text-sm text-muted-foreground mt-2">
                  Format: English text | Hausa translation
                </p>
              </div>

              <Button
                onClick={handleTextUpload}
                disabled={!textData.trim() || isUploading}
                className="w-full bg-accent hover:bg-accent/90"
              >
                {isUploading ? "Uploading..." : "Upload Text"}
              </Button>
            </div>
          </Card>
        </div>

        {/* Statistics */}
        <Card className="p-8 bg-card/50 backdrop-blur-sm mt-8">
          <h2 className="text-2xl font-bold mb-6">Training Statistics</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary mb-2">1,247</p>
              <p className="text-muted-foreground">Total Translations</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-accent mb-2">43</p>
              <p className="text-muted-foreground">Training Files</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-secondary mb-2">94.2%</p>
              <p className="text-muted-foreground">Accuracy Rate</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-500 mb-2">156</p>
              <p className="text-muted-foreground">Multimedia Files</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Admin;
