"use client"

import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal, useState } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink,
  BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { generateGeminiDocumentationDirect, generateChatResponse } from "@/lib/ai-providers"
import { MarkdownRenderer } from '@/components/MarkdownRenderer'
import { ChatSection } from '@/components/ChatSection'

export default function Page() {
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [method, setMethod] = useState('GET')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestBody, setRequestBody] = useState("")
  const [aiProvider, setAiProvider] = useState("gemini")
  const [documentation, setDocumentation] = useState<any>(null)
  const [generatingDocs, setGeneratingDocs] = useState(false)
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant', content: string, timestamp: string }>>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [isChatVisible, setIsChatVisible] = useState(false);

  const analyzeEndpoint = (url: string) => {
    const urlPattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    const securityIssues = [];
    
    if (!urlPattern.test(url)) {
      securityIssues.push("Invalid URL format");
    }
    if (!url.startsWith('https://')) {
      securityIssues.push("Not using HTTPS");
    }
    
    return {
      urlAnalysis: {
        protocol: new URL(url).protocol,
        hostname: new URL(url).hostname,
        pathname: new URL(url).pathname,
        isHttps: url.startsWith('https://'),
      },
      securityIssues
    };
  };

  const analyzeHeaders = (headers: Record<string, string>) => {
    const securityHeaders = {
      'strict-transport-security': false,
      'x-content-type-options': false,
      'x-frame-options': false,
      'x-xss-protection': false,
      'content-security-policy': false,
    };

    const missingHeaders: string[] = [];
    
    Object.keys(securityHeaders).forEach(header => {
      if (!headers[header.toLowerCase()]) {
        missingHeaders.push(header);
      }
    });

    return {
      missingSecurityHeaders: missingHeaders,
      hasSecurityHeaders: missingHeaders.length === 0,
      cors: headers['access-control-allow-origin'] || 'Not specified',
      contentType: headers['content-type'] || 'Not specified',
      caching: headers['cache-control'] || 'Not specified',
    };
  };

  const analyzeResponse = (response: any) => {
    return {
      size: new Blob([JSON.stringify(response)]).size,
      hasError: response.error !== undefined,
      fieldsCount: Object.keys(response).length,
      dataType: Array.isArray(response) ? 'array' : typeof response,
    };
  };

  const analyzeApi = async () => {
    if (!apiEndpoint) {
      setError("Please enter an API endpoint");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const startTime = performance.now();
      const endpointAnalysis = analyzeEndpoint(apiEndpoint);
      
      const requestOptions: RequestInit = {
        method,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      };

      // Add body for POST/PUT requests
      if (method !== 'GET' && requestBody) {
        try {
          requestOptions.body = JSON.stringify(JSON.parse(requestBody));
        } catch (e) {
          setError("Invalid JSON in request body");
          setLoading(false);
          return;
        }
      }

      const res = await fetch(apiEndpoint, requestOptions);
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      const headerAnalysis = analyzeHeaders(Object.fromEntries(res.headers.entries()));
      const responseAnalysis = analyzeResponse(data);
      
      const analysis = {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        timing: responseTime,
        contentType: contentType,
        security: {
          ...headerAnalysis,
          endpointAnalysis,
        },
        response: responseAnalysis,
        metrics: {
          responseTime,
          size: responseAnalysis.size,
          timestamp: new Date().toISOString(),
        },
        suggestions: [
          ...endpointAnalysis.securityIssues,
          ...headerAnalysis.missingSecurityHeaders.map(h => `Missing security header: ${h}`),
          responseTime > 1000 ? "High response time" : null,
          !contentType ? "Missing content type header" : null,
        ].filter(Boolean),
      };
      
      setResponse(analysis);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch API");
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const generateDocumentation = async () => {
    if (!response) return;
    
    try {
      setGeneratingDocs(true);
      
      if (aiProvider === "gemini") {
        try {
          // Use our new direct API call function
          const docResult = await generateGeminiDocumentationDirect(apiEndpoint, method, response);
          setDocumentation(docResult);
        } catch (error) {
          console.error('Error calling Gemini API:', error);
          setDocumentation({
            content: "Failed to generate documentation with Gemini. Please check your API key or try again later.",
            error: true,
            provider: "Gemini API (Error)",
            timestamp: new Date().toISOString(),
          });
        }
      } else if (aiProvider === "mock") {
        // For development/testing without API keys
        await new Promise(resolve => setTimeout(resolve, 1500));
        setDocumentation({
          content: `# API Documentation for ${apiEndpoint}
          
## Endpoint: \`${apiEndpoint}\`
Method: \`${method}\`

## Description
This endpoint allows you to retrieve data from the service.

## Request Parameters
No parameters required for this endpoint.

## Response Structure
\`\`\`json
${JSON.stringify(response.data, null, 2)}
\`\`\`

## Example Usage

### JavaScript
\`\`\`javascript
fetch('${apiEndpoint}')
  .then(response => response.json())
  .then(data => console.log(data));
\`\`\`

## Authentication
No authentication detected for this endpoint.

## Error Handling
Standard HTTP status codes are used:
- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found

## Rate Limiting
No explicit rate limiting detected.
`,
          provider: "Mock Provider (Demo)",
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error generating documentation:', error);
      setDocumentation({
        content: "An error occurred while generating documentation. Please try again.",
        error: true,
        provider: "Error",
        timestamp: new Date().toISOString(),
      });
    } finally {
      setGeneratingDocs(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    if (!response) {
      setError("Please analyze an API endpoint first");
      return;
    }

    try {
      setChatLoading(true);
      
      // Add user message
      const userMessage = {
        role: 'user' as const,
        content: message,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);

      // Prepare comprehensive API context
      const apiContext = {
        endpoint: apiEndpoint,
        method: method,
        response: {
          ...response,
          securityScore: calculateSecurityScore(response),
          performanceMetrics: {
            responseTime: response.timing,
            responseSize: response.response.size,
            isPerformant: response.timing < 500, // threshold for good performance
          },
          securityIssues: response.suggestions.filter((s: string) => 
            s.toLowerCase().includes('security') || 
            s.toLowerCase().includes('header') ||
            s.toLowerCase().includes('https')
          ),
          totalIssues: response.suggestions.length,
          data: response.data,
        }
      };

      // Use the chat-specific function with enhanced context
      const result = await generateChatResponse(
        apiEndpoint,
        method,
        apiContext,
        message
      );

      // Add AI response
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: result.content,
        timestamp: new Date().toISOString()
      }]);
  
    } catch (error) {
      console.error('Chat error:', error);
      setError('Failed to generate response');
    } finally {
      setChatLoading(false);
    }
  };

  const calculateSecurityScore = (analysis: any) => {
    if (!analysis) return 0;
    
    let score = 100;
    const deductions = {
      'Missing strict-transport-security': 15,
      'Missing x-content-type-options': 10,
      'Missing x-frame-options': 10,
      'Missing x-xss-protection': 10,
      'Missing content-security-policy': 15,
      'Not using HTTPS': 20,
      'High response time': 10,
      'Missing content type header': 10
    };

    analysis.suggestions.forEach((suggestion: string) => {
      Object.entries(deductions).forEach(([issue, points]) => {
        if (suggestion.toLowerCase().includes(issue.toLowerCase())) {
          score -= points;
        }
      });
    });

    return Math.max(0, score);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">API Analysis</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* API Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>API Endpoint Analysis</CardTitle>
              <CardDescription>Enter an API endpoint to begin analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    {error}
                  </div>
                )}
                <div className="flex gap-4">
                  <Input 
                    placeholder="https://api.example.com/v1/endpoint" 
                    value={apiEndpoint}
                    onChange={(e) => setApiEndpoint(e.target.value)}
                    className="flex-1"
                  />
                  <select
                    className="border rounded px-3 py-2"
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                  >
                    <option>GET</option>
                    <option>POST</option>
                    <option>PUT</option>
                    <option>DELETE</option>
                  </select>
                  <Button 
                    onClick={analyzeApi} 
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Analyze'}
                  </Button>
                </div>
                
                {/* Request Body Input */}
                {method !== 'GET' && (
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-muted-foreground">
                      Request Body (JSON)
                    </label>
                    <textarea
                      className="w-full h-32 p-2 border rounded-md font-mono text-sm"
                      placeholder='{
  "key": "value",
  "example": 123
}'
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          <Tabs defaultValue="overview" className="flex-1">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="documentation">Documentation</TabsTrigger>
            </TabsList>
            <div className="grid gap-4 py-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Score</CardTitle>
                    <CardDescription>Overall security assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      response ? (
                        calculateSecurityScore(response) >= 80 ? 'text-green-600' :
                        calculateSecurityScore(response) >= 60 ? 'text-yellow-600' :
                        'text-red-600'
                      ) : 'text-gray-400'
                    }`}>
                      {response ? `${calculateSecurityScore(response)}/100` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average API response time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      response ? (
                        response.timing < 200 ? 'text-green-600' :
                        response.timing < 500 ? 'text-yellow-600' :
                        'text-red-600'
                      ) : 'text-gray-400'
                    }`}>
                      {response ? `${response.timing.toFixed(0)}ms` : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Issues Found</CardTitle>
                    <CardDescription>Potential improvements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${
                      response ? (
                        response.suggestions.length === 0 ? 'text-green-600' :
                        response.suggestions.length <= 3 ? 'text-yellow-600' :
                        'text-red-600'
                      ) : 'text-gray-400'
                    }`}>
                      {response ? response.suggestions.length : 'N/A'}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <TabsContent value="overview" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Overview</CardTitle>
                    <CardDescription>Comprehensive API analysis results</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {response ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <h3 className="font-medium">Endpoint Info</h3>
                            <p>Protocol: {response.security.endpointAnalysis.urlAnalysis.protocol}</p>
                            <p>Host: {response.security.endpointAnalysis.urlAnalysis.hostname}</p>
                            <p>Path: {response.security.endpointAnalysis.urlAnalysis.pathname}</p>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-medium">Response Info</h3>
                            <p>Status: {response.status}</p>
                            <p>Size: {(response.response.size / 1024).toFixed(2)} KB</p>
                            <p>Fields: {response.response.fieldsCount}</p>
                          </div>
                        </div>
                        
                        {response.suggestions.length > 0 && (
                          <div className="mt-4">
                            <h3 className="font-medium mb-2">Suggestions</h3>
                            <ul className="space-y-2">
                              {response.suggestions.map((suggestion: string, i: Key) => (
                                <li key={i} className="flex items-center gap-2 text-yellow-600">
                                  <AlertTriangle className="h-4 w-4" />
                                  {suggestion}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Enter an API endpoint above to see AI-generated insights.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Analysis</CardTitle>
                    <CardDescription>Security headers and potential vulnerabilities</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {response ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-medium mb-2">Security Headers</h3>
                            <ul className="space-y-2">
                              {Object.entries(response.security).map(([key, value]) => (
                                key !== 'endpointAnalysis' && (
                                  <li key={key} className="flex items-center gap-2">
                                    {typeof value === 'boolean' ? (
                                      value ? (
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                      )
                                    ) : null}
                                    {key}: {String(value)}
                                  </li>
                                )
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h3 className="font-medium mb-2">CORS & Access</h3>
                            <p>CORS Policy: {response.security.cors}</p>
                            <p>Protocol: {response.security.endpointAnalysis.urlAnalysis.protocol}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Security analysis will appear here after you analyze an endpoint.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="performance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Response time and optimization suggestions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        Performance metrics will appear here after you analyze an endpoint.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documentation" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex justify-between items-center">
                      <div>AI-Generated Documentation</div>
                      <div className="flex items-center gap-2">
                        <Select
                          value={aiProvider}
                          onValueChange={setAiProvider}
                          disabled={generatingDocs}
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select AI Provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="gemini">Gemini AI</SelectItem>
                            <SelectItem value="mock">Demo Provider</SelectItem>
                            {/* You can add more providers here */}
                          </SelectContent>
                        </Select>
                        
                        <Button
                          onClick={generateDocumentation}
                          disabled={!response || generatingDocs}
                          size="sm"
                        >
                          {generatingDocs ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Docs"
                          )}
                        </Button>
                      </div>
                    </CardTitle>
                    <CardDescription>
                      {documentation ? 
                        `Generated using ${documentation.provider} on ${new Date(documentation.timestamp).toLocaleString()}` :
                        "Generate API documentation powered by AI"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {documentation ? (
                      <div className="rounded-lg border p-4 bg-muted/50">
                        {documentation.error ? (
                          <div className="text-red-500">{documentation.content}</div>
                        ) : (
                          <MarkdownRenderer content={documentation.content} />
                        )}
                      </div>
                    ) : response ? (
                      <div className="rounded-lg border p-4 flex flex-col items-center justify-center py-12">
                        <p className="text-sm text-muted-foreground mb-4">
                          API analyzed successfully. Generate documentation to see AI-powered insights.
                        </p>
                        <Button 
                          onClick={generateDocumentation} 
                          disabled={generatingDocs}
                        >
                          {generatingDocs ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            "Generate Documentation"
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="rounded-lg border p-4">
                        <p className="text-sm text-muted-foreground">
                          First analyze an API endpoint to generate documentation.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
              {response && (
                <Card>
                  <CardContent className="pt-6">
                    <Tabs defaultValue="response">
                      <TabsList>
                        <TabsTrigger value="response">Response</TabsTrigger>
                        <TabsTrigger value="headers">Headers</TabsTrigger>
                        <TabsTrigger value="metrics">Metrics</TabsTrigger>
                      </TabsList>
                      <TabsContent value="response">
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 whitespace-pre-wrap">
                          {typeof response.data === 'object' 
                            ? JSON.stringify(response.data, null, 2)
                            : response.data}
                        </pre>
                      </TabsContent>
                      <TabsContent value="headers">
                        <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96">
                          {JSON.stringify(response.headers, null, 2)}
                        </pre>
                      </TabsContent>
                      <TabsContent value="metrics">
                        <div className="p-4 space-y-2">
                          <p>Status Code: {response.status}</p>
                          <p>Response Time: {response.timing.toFixed(2)}ms</p>
                          <p>Content Type: {response.contentType}</p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              )}
            </div>
          </Tabs>
        </div>
      </SidebarInset>

      {/* Floating Chat */}
      {response && (
        <>
          <Button
            className="fixed bottom-4 right-4 z-40 shadow-lg"
            onClick={() => setIsChatVisible(!isChatVisible)}
            variant="default"
          >
            {isChatVisible ? "Hide Chat" : "Show Chat"}
          </Button>

          {isChatVisible && (
            <ChatSection
              messages={messages}
              loading={chatLoading}
              onSendMessage={handleChatMessage}
            />
          )}
        </>
      )}
    </SidebarProvider>
  );
}