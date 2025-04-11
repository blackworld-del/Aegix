import { GoogleGenerativeAI } from "@google/generative-ai";

export interface DocumentationResult {
  content: string;
  provider: string;
  timestamp: string;
  error?: boolean;
}

export async function generateGeminiDocumentationDirect(
  apiEndpoint: string,
  method: string,
  response: any
): Promise<DocumentationResult> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error("Missing API key. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
    }

    const prompt = `
      Generate comprehensive API documentation based on this API response:
      
      URL: ${apiEndpoint}
      Method: ${method}
      Status Code: ${response.status}
      Response Time: ${response.timing.toFixed(2)}ms
      
      Headers:
      ${JSON.stringify(response.headers, null, 2)}
      
      Response Body: 
      ${JSON.stringify(response.data, null, 2)}
      
      Please include:
      1. Endpoint description
      2. Request parameters
      3. Response structure
      4. Example usage with code samples
      5. Error handling recommendations
      6. Authentication requirements (if detected)
      7. Rate limiting information (if detected)
      
      Format the documentation in clean markdown with proper HTML-compatible syntax.
      Use --- for horizontal rules.
      Use proper code block formatting with language hints.
      Use tables where appropriate.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
      contents: [
        {
          parts: [
            {
              text: prompt
            }
          ]
        }
      ]
    };

    const response_ai = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    if (!response_ai.ok) {
      throw new Error(`API request failed: ${response_ai.status} ${response_ai.statusText}`);
    }

    const result = await response_ai.json();
    const text = result.candidates[0].content.parts[0].text;
    
    return {
      content: text,
      provider: "Gemini API",
      timestamp: new Date().toISOString(),
    };
    
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return {
      content: `Error generating documentation: ${error.message || "Unknown error"}`,
      provider: "Gemini API (Error)",
      timestamp: new Date().toISOString(),
      error: true,
    };
  }
}

export async function generateChatResponse(
  apiEndpoint: string,
  method: string,
  apiContext: any,
  question: string
): Promise<DocumentationResult> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error("Missing API key");
    }

    const prompt = `
      You are an API expert assistant. Answer the following question about this API:
      
      API Context:
      - Endpoint: ${apiEndpoint}
      - Method: ${method}
      - Security Score: ${apiContext.response.securityScore}/100
      - Response Time: ${apiContext.response.performanceMetrics.responseTime.toFixed(2)}ms
      - Total Issues Found: ${apiContext.response.totalIssues}
      - Security Issues: ${apiContext.response.securityIssues.join(', ')}
      
      Response Data Sample:
      ${JSON.stringify(apiContext.response.data, null, 2)}

      Performance Metrics:
      - Response Size: ${(apiContext.response.performanceMetrics.responseSize / 1024).toFixed(2)} KB
      - Performance Status: ${apiContext.response.performanceMetrics.isPerformant ? 'Good' : 'Needs Improvement'}
      
      User Question: ${question}
      
      Please provide a detailed answer based on the actual API analysis data above. 
      Include specific metrics and issues when relevant to the question.
      If discussing problems or improvements, refer to the actual issues found.
    `;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    
    const payload = {
      contents: [{
        parts: [{ text: prompt }]
      }]
    };

    const response_ai = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response_ai.ok) {
      throw new Error(`AI request failed: ${response_ai.status}`);
    }

    const result = await response_ai.json();
    const text = result.candidates[0].content.parts[0].text;
    
    return {
      content: text,
      provider: "Gemini AI",
      timestamp: new Date().toISOString(),
    };
    
  } catch (error: any) {
    console.error("Chat response error:", error);
    return {
      content: `Failed to generate response: ${error.message}`,
      provider: "Gemini AI (Error)",
      timestamp: new Date().toISOString(),
      error: true,
    };
  }
}

export async function generateGeminiDocumentation(
  apiEndpoint: string,
  method: string,
  response: any
): Promise<DocumentationResult> {
  try {
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!API_KEY) {
      throw new Error("Missing API key. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `
      Generate comprehensive API documentation based on this API response:
      
      URL: ${apiEndpoint}
      Method: ${method}
      Status Code: ${response.status}
      Response Time: ${response.timing.toFixed(2)}ms
      
      Headers:
      ${JSON.stringify(response.headers, null, 2)}
      
      Response Body: 
      ${JSON.stringify(response.data, null, 2)}
      
      Please include:
      1. Endpoint description
      2. Request parameters
      3. Response structure
      4. Example usage with code samples
      5. Error handling recommendations
      6. Authentication requirements (if detected)
      7. Rate limiting information (if detected)
      
      Format the documentation in clean markdown with proper HTML-compatible syntax.
      Use --- for horizontal rules.
      Use proper code block formatting with language hints.
      Use tables where appropriate.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    return {
      content: text,
      provider: "Gemini AI",
      timestamp: new Date().toISOString(),
    };
    
  } catch (error: any) {
    console.error("Gemini API error:", error);
    return {
      content: `Error generating documentation: ${error.message || "Unknown error"}`,
      provider: "Gemini AI (Error)",
      timestamp: new Date().toISOString(),
      error: true,
    };
  }
}
