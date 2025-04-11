import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Send, X, Maximize2, Minimize2 } from "lucide-react";
import { MarkdownRenderer } from './MarkdownRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface ChatSectionProps {
  messages: Message[];
  loading: boolean;
  onSendMessage: (message: string) => void;
}

export const ChatSection: React.FC<ChatSectionProps> = ({ messages, loading, onSendMessage }) => {
  const [input, setInput] = React.useState('');
  const [isExpanded, setIsExpanded] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(scrollToBottom, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Card className={`fixed bottom-4 right-4 z-50 flex flex-col shadow-xl transition-all duration-200 ${
      isExpanded ? 'w-[600px] h-[600px]' : 'w-[400px] h-[500px]'
    }`}>
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold">API Chat Assistant</h3>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div className={`max-w-[80%] rounded-lg p-3 ${
              message.role === 'user' 
                ? 'bg-primary text-primary-foreground ml-4' 
                : 'bg-muted mr-4'
            }`}>
              <div className="prose prose-sm max-w-none">
                <MarkdownRenderer content={message.content} />
              </div>
              <div className="text-xs mt-2 opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the API..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>
      </form>
    </Card>
  );
};
