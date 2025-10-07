'use client';

import { useState } from 'react';
import DashboardLayout from '../../../components/dashboard/DashboardLayout';
import { 
  Shield, 
  Smartphone, 
  Lock, 
  Key, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Camera,
  Fingerprint,
  Bell,
  Globe,
  Clock,
  RefreshCw,
  X,
  Plus,
  Trash2,
  Edit3
} from 'lucide-react';

export default function SecurityPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  const [securitySettings, setSecuritySettings] = useState({
    mobileApproval: true,
    facePayApproval: true,
    twoFactorAuth: true,
    loginNotifications: true,
    transactionAlerts: true,
    deviceTracking: true,
    sessionTimeout: 30
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [pinForm, setPinForm] = useState({
    currentPin: '',
    newPin: '',
    confirmPin: ''
  });

  const [securityQuestions, setSecurityQuestions] = useState([
    { id: 1, question: 'What was the name of your first pet?', answer: '', isSet: false },
    { id: 2, question: 'In what city were you born?', answer: '', isSet: false },
    { id: 3, question: 'What was your childhood nickname?', answer: '', isSet: false }
  ]);

  const [trustedDevices, setTrustedDevices] = useState([
    {
      id: 1,
      name: 'iPhone 14 Pro',
      type: 'mobile',
      location: 'Lagos, Nigeria',
      lastUsed: '2 hours ago',
      current: true
    },
    {
      id: 2,
      name: 'MacBook Pro',
      type: 'desktop',
      location: 'Lagos, Nigeria',
      lastUsed: '1 day ago',
      current: false
    }
  ]);

  const [loginHistory, setLoginHistory] = useState([
    {
      id: 1,
      device: 'iPhone 14 Pro',
      location: 'Lagos, Nigeria',
      time: '2 hours ago',
      status: 'success',
      ip: '197.210.xxx.xxx'
    },
    {
      id: 2,
      device: 'MacBook Pro',
      location: 'Lagos, Nigeria',
      time: '1 day ago',
      status: 'success',
      ip: '197.210.xxx.xxx'
    },
    {
      id: 3,
      device: 'Unknown Device',
      location: 'Abuja, Nigeria',
      time: '3 days ago',
      status: 'blocked',
      ip: '102.89.xxx.xxx'
    }
  ]);

  const [fraudAlerts, setFraudAlerts] = useState([
    {
      id: 1,
      type: 'location_mismatch',
      title: 'Suspicious Transaction Blocked',
      description: 'Face Pay transaction blocked due to location mismatch',
      userLocation: 'Lagos, Nigeria',
      merchantLocation: 'Abuja, Nigeria',
      distance: '756 km',
      amount: '₦25,000',
      merchant: 'TechMart Electronics',
      time: '1 hour ago',
      status: 'blocked',
      riskLevel: 'high'
    },
    {
      id: 2,
      type: 'location_mismatch',
      title: 'Transaction Flagged for Review',
      description: 'Face Pay transaction flagged due to unusual location',
      userLocation: 'Ikeja, Lagos',
      merchantLocation: 'Victoria Island, Lagos',
      distance: '15 km',
      amount: '₦8,500',
      merchant: 'Coffee Bean Cafe',
      time: '2 days ago',
      status: 'reviewed',
      riskLevel: 'medium'
    },
    {
      id: 3,
      type: 'location_mismatch',
      title: 'High-Risk Transaction Prevented',
      description: 'Face Pay blocked - user and merchant locations too far apart',
      userLocation: 'Lagos, Nigeria',
      merchantLocation: 'Kano, Nigeria',
      distance: '967 km',
      amount: '₦150,000',
      merchant: 'Northern Electronics Hub',
      time: '5 days ago',
      status: 'blocked',
      riskLevel: 'high'
    }
  ]);

  const tabs = [
    { id: 'overview', title: 'Security Overview', icon: Shield },
    { id: 'authentication', title: 'Authentication', icon: Lock },
    { id: 'devices', title: 'Trusted Devices', icon: Smartphone },
    { id: 'activity', title: 'Login Activity', icon: Clock },
    { id: 'fraud', title: 'Fraud Alerts', icon: AlertCircle }
  ];

  const handleSettingToggle = (setting) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Password change requested');
    // Handle password change
  };

  const handlePinChange = (e) => {
    e.preventDefault();
    console.log('PIN change requested');
    // Handle PIN change
  };

  const renderSecurityOverview = () => (
    <div className="space-y-6">
      {/* Security Score */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Security Score</h3>
          <div className="flex items-center space-x-2">
            <div className="w-16 h-16 relative">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="#1a2e5d"
                  strokeWidth="3"
                  strokeDasharray="85, 100"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-primary">85%</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">Strong Password</p>
              <p className="text-xs text-green-700">Last changed 30 days ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-green-900">2FA Enabled</p>
              <p className="text-xs text-green-700">SMS & Biometric</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
            <div>
              <p className="text-sm font-medium text-yellow-900">Security Questions</p>
              <p className="text-xs text-yellow-700">2 of 3 completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Mobile Approval</p>
                <p className="text-sm text-gray-600">Approve transactions on your mobile device</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.mobileApproval}
                onChange={() => handleSettingToggle('mobileApproval')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Camera className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Face Pay Approval</p>
                <p className="text-sm text-gray-600">Require additional approval for Face Pay transactions</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.facePayApproval}
                onChange={() => handleSettingToggle('facePayApproval')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bell className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-gray-900">Login Notifications</p>
                <p className="text-sm text-gray-600">Get notified of new login attempts</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.loginNotifications}
                onChange={() => handleSettingToggle('loginNotifications')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Recent Security Activity */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Security Activity</h3>
        
        <div className="space-y-4">
          {loginHistory.slice(0, 3).map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className={`w-2 h-2 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.device}</p>
                  <p className="text-sm text-gray-600">{activity.location} • {activity.time}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                activity.status === 'success' ? 'bg-green-100 text-green-800' :
                activity.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {activity.status}
              </span>
            </div>
          ))}
        </div>
        
        <button className="w-full mt-4 py-2 text-primary hover:text-primary/80 font-medium text-sm">
          View All Activity →
        </button>
      </div>
    </div>
  );

  const renderAuthentication = () => (
    <div className="space-y-6">
      {/* Change Password */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Change Password</h3>
        
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              required
            />
          </div>
          
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Update Password
          </button>
        </form>
      </div>

      {/* Change PIN */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Transaction PIN</h3>
        
        <form onSubmit={handlePinChange} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={pinForm.currentPin}
                onChange={(e) => setPinForm(prev => ({ ...prev, currentPin: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="••••"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={pinForm.newPin}
                onChange={(e) => setPinForm(prev => ({ ...prev, newPin: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="••••"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm PIN
              </label>
              <input
                type="password"
                maxLength="4"
                value={pinForm.confirmPin}
                onChange={(e) => setPinForm(prev => ({ ...prev, confirmPin: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl tracking-widest"
                placeholder="••••"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold"
          >
            Update PIN
          </button>
        </form>
      </div>

      {/* Security Questions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Questions</h3>
        
        <div className="space-y-4">
          {securityQuestions.map((question, index) => (
            <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <p className="font-medium text-gray-900">{question.question}</p>
                {question.isSet ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-500" />
                )}
              </div>
              
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={question.answer}
                  onChange={(e) => {
                    const updated = [...securityQuestions];
                    updated[index].answer = e.target.value;
                    setSecurityQuestions(updated);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Enter your answer"
                />
                <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Factor Authentication */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Two-Factor Authentication</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">SMS Authentication</p>
                <p className="text-sm text-green-700">+234 *** *** **45</p>
              </div>
            </div>
            <button className="text-green-700 hover:text-green-800 font-medium text-sm">
              Change Number
            </button>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <p className="font-medium text-green-900">Biometric Authentication</p>
                <p className="text-sm text-green-700">Face ID & Fingerprint enabled</p>
              </div>
            </div>
            <button className="text-green-700 hover:text-green-800 font-medium text-sm">
              Manage
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTrustedDevices = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Trusted Devices</h3>
          <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm">
            Add Device
          </button>
        </div>
        
        <div className="space-y-4">
          {trustedDevices.map((device) => (
            <div key={device.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Smartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-medium text-gray-900">{device.name}</p>
                    {device.current && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{device.location}</p>
                  <p className="text-xs text-gray-500">Last used: {device.lastUsed}</p>
                </div>
              </div>
              
              {!device.current && (
                <button className="text-red-600 hover:text-red-700 p-2">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderLoginActivity = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Login History</h3>
        
        <div className="space-y-4">
          {loginHistory.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className={`w-3 h-3 rounded-full ${
                  activity.status === 'success' ? 'bg-green-500' :
                  activity.status === 'blocked' ? 'bg-red-500' : 'bg-yellow-500'
                }`} />
                <div>
                  <p className="font-medium text-gray-900">{activity.device}</p>
                  <p className="text-sm text-gray-600">{activity.location}</p>
                  <p className="text-xs text-gray-500">{activity.ip} • {activity.time}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  activity.status === 'success' ? 'bg-green-100 text-green-800' :
                  activity.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {activity.status}
                </span>
                
                {activity.status === 'blocked' && (
                  <button className="text-primary hover:text-primary/80 text-sm font-medium">
                    Review
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFraudAlerts = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Fraud Detection Alerts</h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Auto-protection:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={securitySettings.fraudProtection}
                onChange={() => handleSettingToggle('fraudProtection')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        </div>
        
        <div className="space-y-4">
          {fraudAlerts.map((alert) => (
            <div key={alert.id} className={`p-4 border rounded-lg ${
              alert.riskLevel === 'high' ? 'border-red-200 bg-red-50' :
              alert.riskLevel === 'medium' ? 'border-yellow-200 bg-yellow-50' :
              'border-gray-200 bg-gray-50'
            }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    alert.riskLevel === 'high' ? 'bg-red-100' :
                    alert.riskLevel === 'medium' ? 'bg-yellow-100' :
                    'bg-gray-100'
                  }`}>
                    <AlertCircle className={`w-4 h-4 ${
                      alert.riskLevel === 'high' ? 'text-red-600' :
                      alert.riskLevel === 'medium' ? 'text-yellow-600' :
                      'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    alert.status === 'blocked' ? 'bg-red-100 text-red-800' :
                    alert.status === 'reviewed' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {alert.status}
                  </span>
                  <span className="text-xs text-gray-500">{alert.time}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-3 bg-white rounded-lg border border-gray-200">
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Transaction Details</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{alert.amount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant:</span>
                      <span className="font-medium">{alert.merchant}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h5 className="text-sm font-medium text-gray-900 mb-2">Location Analysis</h5>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Your Location:</span>
                      <span className="font-medium">{alert.userLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Merchant Location:</span>
                      <span className="font-medium">{alert.merchantLocation}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Distance:</span>
                      <span className={`font-medium ${
                        parseInt(alert.distance) > 500 ? 'text-red-600' :
                        parseInt(alert.distance) > 50 ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>{alert.distance}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Risk Level:</span>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    alert.riskLevel === 'high' ? 'bg-red-100 text-red-800' :
                    alert.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {alert.riskLevel.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  {alert.status === 'blocked' && (
                    <>
                      <button className="px-3 py-1 text-sm text-green-600 hover:text-green-700 font-medium">
                        Mark as Safe
                      </button>
                      <button className="px-3 py-1 text-sm text-primary hover:text-primary/80 font-medium">
                        Review Details
                      </button>
                    </>
                  )}
                  {alert.status === 'reviewed' && (
                    <button className="px-3 py-1 text-sm text-primary hover:text-primary/80 font-medium">
                      View Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How Fraud Detection Works:</p>
              <ul className="space-y-1">
                <li>• Analyzes distance between user and merchant locations</li>
                <li>• Blocks transactions when locations are suspiciously far apart</li>
                <li>• Uses GPS and device location for real-time verification</li>
                <li>• Automatically flags high-risk transactions for review</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <DashboardLayout 
      title="Security Settings" 
      subtitle="Manage your account security and privacy settings"
    >
      <div className="space-y-8">
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
          {activeTab === 'overview' && renderSecurityOverview()}
          {activeTab === 'authentication' && renderAuthentication()}
          {activeTab === 'devices' && renderTrustedDevices()}
          {activeTab === 'activity' && renderLoginActivity()}
          {activeTab === 'fraud' && renderFraudAlerts()}
        </div>
      </div>
    </DashboardLayout>
  );
}
