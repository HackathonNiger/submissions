'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Code, 
  Key, 
  Globe, 
  FileText, 
  Copy, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  Download,
  Book,
  Zap,
  Shield,
  Clock,
  Activity,
  Settings,
  Terminal,
  Webhook
} from 'lucide-react';

export default function IntegrationPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showApiKey, setShowApiKey] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);

  const [apiKeys, setApiKeys] = useState([
    {
      id: 1,
      name: 'Production API Key',
      key: 'gp_live_1234567890abcdef1234567890abcdef',
      environment: 'live',
      created: '2024-01-15',
      lastUsed: '2 hours ago',
      status: 'active'
    },
    {
      id: 2,
      name: 'Test API Key',
      key: 'gp_test_abcdef1234567890abcdef1234567890',
      environment: 'test',
      created: '2024-01-15',
      lastUsed: '1 day ago',
      status: 'active'
    }
  ]);

  const [webhooks, setWebhooks] = useState([
    {
      id: 1,
      url: 'https://mystore.com/webhooks/gestpay',
      events: ['payment.completed', 'payment.failed', 'customer.created'],
      status: 'active',
      lastDelivery: '2 minutes ago',
      deliveryRate: 99.8
    },
    {
      id: 2,
      url: 'https://api.myapp.com/gestpay/webhooks',
      events: ['payment.completed', 'biometric.verified'],
      status: 'active',
      lastDelivery: '5 minutes ago',
      deliveryRate: 100.0
    }
  ]);

  const tabs = [
    { id: 'overview', title: 'Overview', icon: Globe },
    { id: 'api-keys', title: 'API Keys', icon: Key },
    { id: 'webhooks', title: 'Webhooks', icon: Webhook },
    { id: 'documentation', title: 'Documentation', icon: FileText }
  ];

  const apiEndpoints = [
    {
      method: 'POST',
      endpoint: '/v1/payments',
      description: 'Create a new payment',
      category: 'Payments'
    },
    {
      method: 'GET',
      endpoint: '/v1/payments/{id}',
      description: 'Retrieve payment details',
      category: 'Payments'
    },
    {
      method: 'POST',
      endpoint: '/v1/biometric/verify',
      description: 'Verify biometric authentication',
      category: 'Biometric'
    },
    {
      method: 'POST',
      endpoint: '/v1/customers',
      description: 'Create a new customer',
      category: 'Customers'
    },
    {
      method: 'GET',
      endpoint: '/v1/transactions',
      description: 'List all transactions',
      category: 'Transactions'
    }
  ];

  const sdks = [
    {
      name: 'Node.js',
      description: 'Official GestPay SDK for Node.js applications',
      version: 'v2.1.0',
      downloads: '12.5k',
      icon: '🟢'
    },
    {
      name: 'Python',
      description: 'Python SDK with async support',
      version: 'v1.8.2',
      downloads: '8.3k',
      icon: '🐍'
    },
    {
      name: 'PHP',
      description: 'PHP SDK for Laravel and other frameworks',
      version: 'v1.5.1',
      downloads: '6.7k',
      icon: '🐘'
    },
    {
      name: 'React Native',
      description: 'Mobile SDK for React Native apps',
      version: 'v1.2.0',
      downloads: '4.2k',
      icon: '📱'
    }
  ];

  const codeExamples = {
    curl: `curl -X POST https://api.gestpay.com/v1/payments \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 10000,
    "currency": "NGN",
    "customer_id": "cust_123",
    "payment_method": "face_pay",
    "description": "Coffee purchase"
  }'`,
    
    javascript: `const gestpay = require('gestpay-node');

const client = new gestpay.Client('YOUR_API_KEY');

const payment = await client.payments.create({
  amount: 10000,
  currency: 'NGN',
  customer_id: 'cust_123',
  payment_method: 'face_pay',
  description: 'Coffee purchase'
});

console.log(payment);`,

    python: `import gestpay

client = gestpay.Client('YOUR_API_KEY')

payment = client.payments.create(
    amount=10000,
    currency='NGN',
    customer_id='cust_123',
    payment_method='face_pay',
    description='Coffee purchase'
)

print(payment)`
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
  };

  const handleCopyApiKey = (key) => {
    navigator.clipboard.writeText(key);
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Quick Start */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Quick Start Guide</h3>
            <p className="text-gray-600">Get started with GestPay API in minutes</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">1</span>
              <h4 className="font-medium text-gray-900">Get API Keys</h4>
            </div>
            <p className="text-sm text-gray-600">Generate your test and live API keys from the API Keys section.</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">2</span>
              <h4 className="font-medium text-gray-900">Make First Call</h4>
            </div>
            <p className="text-sm text-gray-600">Use our API to create your first payment or customer.</p>
          </div>
          
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">3</span>
              <h4 className="font-medium text-gray-900">Go Live</h4>
            </div>
            <p className="text-sm text-gray-600">Switch to live keys and start accepting real payments.</p>
          </div>
        </div>
      </div>

      {/* API Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">API Calls (24h)</p>
              <p className="text-2xl font-bold text-gray-900">12,847</p>
            </div>
            <Activity className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-gray-900">99.2%</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response</p>
              <p className="text-2xl font-bold text-gray-900">145ms</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rate Limit</p>
              <p className="text-2xl font-bold text-gray-900">1000/min</p>
            </div>
            <Shield className="w-8 h-8 text-primary" />
          </div>
        </div>
      </div>

      {/* Popular Endpoints */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Popular API Endpoints</h3>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            View All Endpoints →
          </button>
        </div>
        
        <div className="space-y-3">
          {apiEndpoints.slice(0, 5).map((endpoint, index) => (
            <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  endpoint.method === 'GET' ? 'bg-green-100 text-green-800' :
                  endpoint.method === 'POST' ? 'bg-blue-100 text-blue-800' :
                  endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-gray-900">{endpoint.endpoint}</code>
                <span className="text-sm text-gray-600">{endpoint.description}</span>
              </div>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {endpoint.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* SDKs */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Official SDKs</h3>
          <button className="text-primary hover:text-primary/80 text-sm font-medium">
            Request New SDK →
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sdks.map((sdk, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{sdk.icon}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{sdk.name}</h4>
                    <p className="text-sm text-gray-600">{sdk.description}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-gray-400" />
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Version: {sdk.version}</span>
                <span className="text-gray-600">{sdk.downloads} downloads</span>
              </div>
              
              <button className="w-full mt-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium">
                Install & Documentation
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">API Keys</h3>
          <p className="text-gray-600">Manage your API keys for different environments</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Create API Key</span>
        </button>
      </div>

      <div className="space-y-4">
        {apiKeys.map((key) => (
          <div key={key.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${
                  key.environment === 'live' ? 'bg-green-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <h4 className="font-medium text-gray-900">{key.name}</h4>
                  <p className="text-sm text-gray-600">
                    {key.environment === 'live' ? 'Production Environment' : 'Test Environment'}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  key.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {key.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <code className="text-sm font-mono text-gray-900">
                  {showApiKey ? key.key : key.key.replace(/./g, '•').slice(0, 20) + '...'}
                </code>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleCopyApiKey(key.key)}
                    className="p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
              <span>Created: {key.created}</span>
              <span>Last used: {key.lastUsed}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-1">API Key Security:</p>
            <ul className="space-y-1">
              <li>• Keep your API keys secure and never expose them in client-side code</li>
              <li>• Use test keys for development and live keys only in production</li>
              <li>• Rotate your keys regularly for enhanced security</li>
              <li>• Monitor API key usage in the dashboard</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  const renderWebhooks = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Webhooks</h3>
          <p className="text-gray-600">Configure webhook endpoints to receive real-time notifications</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Add Webhook</span>
        </button>
      </div>

      <div className="space-y-4">
        {webhooks.map((webhook) => (
          <div key={webhook.id} className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="font-medium text-gray-900">{webhook.url}</h4>
                <p className="text-sm text-gray-600">
                  Listening to {webhook.events.length} event{webhook.events.length > 1 ? 's' : ''}
                </p>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  webhook.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {webhook.status}
                </span>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <Settings className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">Delivery Rate</p>
                <p className="text-lg font-bold text-green-600">{webhook.deliveryRate}%</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">Last Delivery</p>
                <p className="text-sm text-gray-600">{webhook.lastDelivery}</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-sm font-medium text-gray-900">Events</p>
                <p className="text-sm text-gray-600">{webhook.events.length} configured</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">Subscribed Events:</p>
              <div className="flex flex-wrap gap-2">
                {webhook.events.map((event, index) => (
                  <span key={index} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                    {event}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Available Webhook Events</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            'payment.completed', 'payment.failed', 'payment.pending',
            'customer.created', 'customer.updated', 'biometric.verified',
            'transaction.created', 'refund.processed', 'dispute.created'
          ].map((event, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 border border-gray-200 rounded">
              <code className="text-sm font-mono text-gray-900">{event}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderDocumentation = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Book className="w-6 h-6 text-primary" />
          <h3 className="text-lg font-semibold text-gray-900">API Documentation</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Getting Started</h4>
            <div className="space-y-2">
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Authentication</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Learn how to authenticate API requests</p>
              </a>
              
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Making Requests</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">HTTP methods, headers, and request format</p>
              </a>
              
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Error Handling</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Understanding error codes and responses</p>
              </a>
            </div>
          </div>
          
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">API Reference</h4>
            <div className="space-y-2">
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Payments API</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Create and manage payments</p>
              </a>
              
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Biometric API</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Face and voice authentication</p>
              </a>
              
              <a href="#" className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Customers API</span>
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-xs text-gray-600 mt-1">Manage customer data</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Code Examples */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Code Examples</h3>
        
        <div className="space-y-6">
          {Object.entries(codeExamples).map(([language, code]) => (
            <div key={language} className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900 capitalize">{language}</h4>
                <button
                  onClick={() => handleCopyCode(code)}
                  className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </button>
              </div>
              
              <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                <pre className="text-sm text-gray-100">
                  <code>{code}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="API & Integration" 
      subtitle="Integrate GestPay into your applications"
    >
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.title}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="min-h-[600px]">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'api-keys' && renderApiKeys()}
          {activeTab === 'webhooks' && renderWebhooks()}
          {activeTab === 'documentation' && renderDocumentation()}
        </div>
      </div>
    </DashboardLayout>
  );
}
