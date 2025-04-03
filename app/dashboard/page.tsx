"use client"

import { useState } from "react"
import { AppSidebar } from "../../components/app-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function Page() {
  const [apiEndpoint, setApiEndpoint] = useState("")
  const [method, setMethod] = useState('GET')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestBody, setRequestBody] = useState("")

  const analyzeApi = async () => {
    if (!apiEndpoint) {
      setError("Please enter an API endpoint");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
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

      const analysis = {
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        timing: performance.now(),
        contentType: contentType,
      };
      
      setResponse(analysis);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch API");
      setResponse(null);
    } finally {
      setLoading(false);
    }
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
                    <div className="text-2xl font-bold">95/100</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Response Time</CardTitle>
                    <CardDescription>Average API response time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">124ms</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Issues Found</CardTitle>
                    <CardDescription>Potential improvements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                  </CardContent>
                </Card>
              </div>

              <TabsContent value="overview" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Overview</CardTitle>
                    <CardDescription>AI-powered insights about your API</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        Enter an API endpoint above to see AI-generated insights about its security,
                        performance, and documentation quality.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Analysis</CardTitle>
                    <CardDescription>Detailed security assessment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        Security analysis will appear here after you analyze an endpoint.
                      </p>
                    </div>
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
                    <CardTitle>AI-Generated Documentation</CardTitle>
                    <CardDescription>Automated API documentation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">
                        AI-generated documentation will appear here after you analyze an endpoint.
                      </p>
                    </div>
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
    </SidebarProvider>
  )
}
