"use client";
import { useState, useEffect } from "react";
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
  Brain,
  BookOpen,
  Zap,
  Star,
  ArrowRight,
  Copy,
  Cpu,
  Target,
  Rocket,
  Sun,
  Moon,
  Download,
  Share2,
  Clock,
  Hash,
  FileText as FileTextIcon,
  FileDown
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
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    
    if (newTheme) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Utility functions
  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const getReadingTime = (text: string) => {
    const wordsPerMinute = 200;
    const wordCount = getWordCount(text);
    const minutes = Math.ceil(wordCount / wordsPerMinute);
    return minutes;
  };

  const exportToMarkdown = (title: string, content: string) => {
    const markdown = `# ${title}\n\n${content}`;
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToPDF = async (title: string, content: string) => {
    // Simple PDF generation using browser print
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${title}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; }
              h1 { color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 10px; }
              .content { margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1>${title}</h1>
            <div class="content">${content.replace(/\n/g, '<br>')}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const shareContent = async (title: string, content: string) => {
    const shareData = {
      title: title,
      text: content.substring(0, 200) + '...',
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${title}\n\n${content}\n\nShared from Smart Blog Summarizer`);
      alert('Content copied to clipboard!');
    }
  };

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

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors duration-300">
      {/* Theme Toggle Button */}
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={toggleTheme}
          variant="ghost"
          size="sm"
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-full p-2 hover:scale-110 transition-all duration-300"
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </Button>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-700 rounded-2xl px-8 py-6 shadow-lg">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                Smart Blog Summarizer
              </h1>
            </div>
          </div>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transform any blog into concise summaries with intelligent insights and instant Urdu translations
          </p>
          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <Brain className="h-3 w-3 mr-1" />
              Smart Powered
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Globe className="h-3 w-3 mr-1" />
              Multi-Language
            </Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
              <Zap className="h-3 w-3 mr-1" />
              Lightning Fast
            </Badge>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10"></div>
            <CardHeader className="text-center pb-8 relative z-10">
              <CardTitle className="text-3xl font-bold flex items-center justify-center gap-3 text-slate-800 dark:text-slate-200">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
                  <Globe className="h-6 w-6 text-white" />
                </div>
                Enter Blog URL
              </CardTitle>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Paste any blog URL and get instant intelligent summaries
              </p>
            </CardHeader>
            <CardContent className="space-y-8 relative z-10">
              <form onSubmit={handleSummarise} className="space-y-6">
                <div className="relative group">
                  <Input
                    type="url"
                    placeholder="https://example.com/blog-post"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                    required
                    className="h-14 text-lg pr-14 border-2 border-slate-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 transition-all duration-300 rounded-xl"
                  />
                  <BookOpen className="absolute right-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-slate-400 group-focus-within:text-purple-500 transition-colors" />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-3 h-6 w-6" />
                      Generate Summary
                      <ArrowRight className="ml-3 h-6 w-6" />
                    </>
                  )}
                </Button>
              </form>

              {/* Status Messages */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              {success && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Results Section */}
              {(scrapedText || summary || urduSummary) && (
                <div className="space-y-8 pt-8">
                  <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
                  
                  {/* Scraped Text */}
                  {scrapedText && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Original Content</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20">
                            {getWordCount(scrapedText)} words
                          </Badge>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900/20 border-blue-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {getReadingTime(scrapedText)} min read
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(scrapedText, "original")}
                            className="text-slate-600 hover:text-blue-600"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        value={scrapedText} 
                        readOnly 
                        className="min-h-[150px] resize-none bg-slate-50 dark:bg-slate-900/50 border-2 border-slate-200 focus:border-blue-500 rounded-xl text-slate-700 dark:text-slate-300"
                        placeholder="Original blog content will appear here..."
                      />
                    </div>
                  )}
                  
                  {/* Smart Summary */}
                  {summary && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                            <Cpu className="h-5 w-5 text-purple-600" />
                          </div>
                          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Smart Summary</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 border-purple-200">
                            <Hash className="h-3 w-3 mr-1" />
                            {getWordCount(summary)} words
                          </Badge>
                          <Badge variant="outline" className="bg-purple-50 text-purple-700 dark:bg-purple-900/20 border-purple-200">
                            <Clock className="h-3 w-3 mr-1" />
                            {getReadingTime(summary)} min read
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToMarkdown("Smart Summary", summary)}
                              className="text-slate-600 hover:text-purple-600"
                              title="Export as Markdown"
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToPDF("Smart Summary", summary)}
                              className="text-slate-600 hover:text-purple-600"
                              title="Export as PDF"
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareContent("Smart Summary", summary)}
                              className="text-slate-600 hover:text-purple-600"
                              title="Share"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(summary, "summary")}
                              className="text-slate-600 hover:text-purple-600"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Textarea 
                        value={summary} 
                        readOnly 
                        className="min-h-[120px] resize-none bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-200 focus:border-purple-500 rounded-xl text-slate-700 dark:text-slate-300"
                        placeholder="Intelligent summary will appear here..."
                      />
                    </div>
                  )}
                  
                  {/* Urdu Translation */}
                  {urduSummary && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                            <Languages className="h-5 w-5 text-green-600" />
                          </div>
                          <h3 className="font-bold text-xl text-slate-800 dark:text-slate-200">Urdu Translation</h3>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200">
                            اردو
                          </Badge>
                          <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/20 border-green-200">
                            <Hash className="h-3 w-3 mr-1" />
                            {getWordCount(urduSummary)} words
                          </Badge>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToMarkdown("Urdu Translation", urduSummary)}
                              className="text-slate-600 hover:text-green-600"
                              title="Export as Markdown"
                            >
                              <FileTextIcon className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => exportToPDF("Urdu Translation", urduSummary)}
                              className="text-slate-600 hover:text-green-600"
                              title="Export as PDF"
                            >
                              <FileDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => shareContent("Urdu Translation", urduSummary)}
                              className="text-slate-600 hover:text-green-600"
                              title="Share"
                            >
                              <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(urduSummary, "urdu")}
                              className="text-slate-600 hover:text-green-600"
                              title="Copy to clipboard"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      <Textarea 
                        value={urduSummary} 
                        readOnly 
                        className="min-h-[120px] resize-none bg-green-50 dark:bg-green-900/20 border-2 border-green-200 focus:border-green-500 rounded-xl font-[Noto Nastaliq Urdu], serif text-right text-slate-700 dark:text-slate-300"
                        placeholder="Urdu translation will appear here..."
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <Card className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800 dark:text-slate-200">Smart Powered</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Advanced intelligent models generate smart summaries with deep understanding of content
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Languages className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800 dark:text-slate-200">Multi-Language</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Instant Urdu translations with multiple fallback services for reliability
              </p>
            </Card>
            
            <Card className="text-center p-8 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 rounded-2xl">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-slate-800 dark:text-slate-200">Lightning Fast</h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                Get results in seconds with optimized processing and smart caching
              </p>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center mt-16 text-slate-500 dark:text-slate-400">
            <p className="text-sm">
              Powered by Intelligent Technology • Built with Next.js • Deployed on Vercel
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
