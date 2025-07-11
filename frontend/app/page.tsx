"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Loader2, 
  Globe, 
  FileText, 
  Languages, 
  CheckCircle, 
  AlertCircle,
  Sparkles,
  BookOpen
} from "lucide-react";

const BACKEND_URL ="https://nexium-wajahat-assignment2-41na.vercel.app";

interface SummariseResponse {
  fullText: string;
  summary: string;
  urduSummary: string;
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scrapedText, setScrapedText] = useState("");
  const [summary, setSummary] = useState("");
  const [urduSummary, setUrduSummary] = useState("");

  const handleSummarise = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError("");
    setSuccess("");
    setScrapedText("");
    setSummary("");
    setUrduSummary("");
    
    if (!url.trim()) {
      setError("Please enter a blog URL.");
      return;
    }
    
    setLoading(true);
    
    try {
      console.log('🔍 Making request to:', `${BACKEND_URL}/api/summarise`);
      console.log('📤 Request body:', { url });
      
      const res = await fetch(`${BACKEND_URL}/api/summarise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      console.log('📥 Response status:', res.status);
      console.log('📥 Response ok:', res.ok);
      
      if (!res.ok) {
        let errorData: ErrorResponse = { error: 'Unknown error' };
        try { 
          errorData = await res.json(); 
        } catch {
          errorData.error = res.statusText || `HTTP ${res.status}`;
        }
        throw new Error(errorData.error || `Failed to summarise blog. Status: ${res.status}`);
      }
      
      const data: SummariseResponse = await res.json();
      
      setScrapedText(data.fullText);
      setSummary(data.summary);
      setUrduSummary(data.urduSummary);
      setSuccess("Blog summarized successfully! 🎉");
      
    } catch (err: any) {
      console.error("Frontend error:", err);
      setError(err.message || "Failed to summarise blog. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-blue-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Blog Summarizer
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Transform any blog into concise summaries with AI-powered insights and instant Urdu translations
          </p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-6">
              <CardTitle className="text-2xl font-semibold flex items-center justify-center gap-2">
                <Globe className="h-6 w-6 text-blue-500" />
                Enter Blog URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSummarise} className="space-y-4">
                <div className="relative">
                  <Input
                    type="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                    className="h-12 text-lg pr-12"
                  />
                  <BookOpen className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Generate Summary
                    </>
                  )}
                </Button>
              </form>

              {/* Status Messages */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Results Section */}
              {(scrapedText || summary || urduSummary) && (
                <div className="space-y-6 pt-6">
                  <Separator />
                  
                  {/* Scraped Text */}
                  {scrapedText && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <h3 className="font-semibold text-lg">Original Content</h3>
                        <Badge variant="secondary" className="ml-auto">
                          {scrapedText.length} characters
                        </Badge>
                      </div>
                      <Textarea 
                        value={scrapedText} 
                        readOnly 
                        className="min-h-[120px] resize-none bg-slate-50 dark:bg-slate-900/50"
                        placeholder="Original blog content will appear here..."
                      />
                    </div>
                  )}
                  
                  {/* AI Summary */}
                  {summary && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-purple-500" />
                        <h3 className="font-semibold text-lg">AI Summary</h3>
                        <Badge variant="outline" className="ml-auto bg-purple-50 text-purple-700 dark:bg-purple-900/20">
                          AI Generated
                        </Badge>
                      </div>
                      <Textarea 
                        value={summary} 
                        readOnly 
                        className="min-h-[100px] resize-none bg-purple-50 dark:bg-purple-900/20 border-purple-200"
                        placeholder="AI-generated summary will appear here..."
                      />
                    </div>
                  )}
                  
                  {/* Urdu Translation */}
                  {urduSummary && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Languages className="h-5 w-5 text-green-500" />
                        <h3 className="font-semibold text-lg">Urdu Translation</h3>
                        <Badge variant="outline" className="ml-auto bg-green-50 text-green-700 dark:bg-green-900/20">
                          اردو
                        </Badge>
                      </div>
                      <Textarea 
                        value={urduSummary} 
                        readOnly 
                        className="min-h-[100px] resize-none bg-green-50 dark:bg-green-900/20 border-green-200 font-[Noto Nastaliq Urdu], serif text-right"
                        placeholder="Urdu translation will appear here..."
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Advanced AI models generate intelligent summaries
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Languages className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Language</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Instant Urdu translations with multiple fallback services
              </p>
            </Card>
            
            <Card className="text-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Smart Storage</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Full content in MongoDB, summaries in Supabase
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
