# Aegix API Testing Platform

A modern web application for testing APIs powered by artificial intelligence. The platform provides an intuitive interface for API testing with AI-driven features to help you understand, test, and optimize your APIs.

## Features

### AI-Powered Testing
- **Intelligent Request Generation**: AI assists in creating meaningful API test cases
- **Response Analysis**: AI-driven analysis of API responses
- **Test Suggestions**: Smart suggestions for edge cases and error scenarios
- **Dynamic Documentation**: Auto-generated documentation based on API usage

### Security Features
- **Protected Access**: Secure platform access using environment-based secret keys
- **Rate Limiting**: Controlled access with attempt tracking
- **IP-Based Security**: Advanced IP detection and protection
- **Session Management**: Persistent security state across sessions

### Technical Stack
- Next.js 14 with React
- TypeScript
- Tailwind CSS
- Shadcn UI
- AI Integration
- Environment-based configuration

## Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd aegix-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment:
```env
SECURITY_KEY=your_secret_key_here
```

4. Start the development server:
```bash
npm run dev
```

Access the platform at `http://localhost:3000`

## Using the Platform

### 1. Access the Platform
- Enter through the security checkpoint using your access key
- Platform maintains rate limiting and IP-based access control

### 2. Test Your APIs
- Input your API endpoints
- Let AI assist in generating test cases
- View detailed analysis of responses
- Get intelligent suggestions for improvements

### 3. Features
- AI-powered request generation
- Response validation
- Error detection
- Performance analysis
- Security testing recommendations

## Project Structure

```
aegix-frontend/
├── app/
│   ├── api/               # API endpoints
│   ├── dashboard/         # Testing interface
│   └── security/         # Access control
├── components/           # UI components
├── lib/                 # Utilities
└── public/              # Static assets
```

## Security

### Access Control
- Secret key protection
- IP-based attempt tracking
- Rate limiting (3 attempts/5 minutes)
- 15-minute lockout after failed attempts
- Automatic session cleanup

### API Testing Security
- Secure endpoint handling
- Request validation
- Response sanitization
- Error handling

## Development

### Local Testing
1. Configure your environment variables
2. Run the development server
3. Use the platform to test your APIs
4. Review AI-generated suggestions

### Adding Features
1. Implement new AI capabilities
2. Add testing features
3. Enhance security measures
4. Improve UI/UX

## License

[Your License Here]
