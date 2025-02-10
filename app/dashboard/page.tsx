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
              <div className="flex gap-4">
                <Input 
                  placeholder="https://api.example.com/v1/endpoint" 
                  value={apiEndpoint}
                  onChange={(e) => setApiEndpoint(e.target.value)}
                  className="flex-1"
                />
                <Button>Analyze</Button>
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
            </div>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
