import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  MessageSquare, 
  Users, 
  Heart, 
  MapPin, 
  Mic, 
  Camera, 
  Bell,
  Wifi,
  WifiOff,
  Clock
} from 'lucide-react';
import FeatureCard from '../components/UI/FeatureCard';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [notifications, setNotifications] = useState(0);
  const [sosAlerts, setSosAlerts] = useState(0);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load dashboard data
    loadDashboardData();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      const [notificationsResponse, sosResponse] = await Promise.all([
        apiService.getNotifications(),
        apiService.getSOSAlerts()
      ]);

      if (notificationsResponse.success) {
        const unreadCount = notificationsResponse.data?.filter(n => !n.isRead).length || 0;
        setNotifications(unreadCount);
      }

      if (sosResponse.success) {
        const activeCount = sosResponse.data?.filter(s => s.status === 'active').length || 0;
        setSosAlerts(activeCount);
      }
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const features = [
    {
      icon: AlertTriangle,
      title: 'SOS Alerts',
      description: 'Send emergency alerts and view active incidents',
      path: '/sos',
      status: sosAlerts > 0 ? 'critical' as const : 'normal' as const,
      badge: sosAlerts > 0 ? sosAlerts : undefined
    },
    {
      icon: MessageSquare,
      title: 'Offline Messages',
      description: 'Queue messages for when connectivity returns',
      path: '/messages',
      status: 'normal' as const
    },
    {
      icon: Users,
      title: 'Emergency Contacts',
      description: 'Manage your emergency contact list',
      path: '/contacts',
      status: 'normal' as const
    },
    {
      icon: Heart,
      title: 'Medical ID',
      description: 'Store critical medical information',
      path: '/medical',
      status: 'normal' as const
    },
    {
      icon: MapPin,
      title: 'Live Tracking',
      description: 'Share your location with emergency contacts',
      path: '/tracking',
      status: 'normal' as const
    },
    {
      icon: Mic,
      title: 'Voice Commands',
      description: 'Use voice commands for hands-free operation',
      path: '/voice',
      status: 'normal' as const
    },
    {
      icon: Camera,
      title: 'Photo Evidence',
      description: 'Document and share visual evidence',
      path: '/evidence',
      status: 'normal' as const
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'View system alerts and updates',
      path: '/notifications',
      status: 'normal' as const,
      badge: notifications > 0 ? notifications : undefined
    }
  ];

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.name?.split(' ')[0]}
            </h1>
            <p className="text-gray-600">
              Emergency communication platform dashboard
            </p>
          </div>
          
          <div className="mt-4 lg:mt-0 flex items-center space-x-4">
            {/* Connection Status */}
            <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${
              isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {isOnline ? (
                <Wifi className="h-4 w-4" />
              ) : (
                <WifiOff className="h-4 w-4" />
              )}
              <span className="text-sm font-medium">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>
            
            {/* Current Time */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-full">
              <Clock className="h-4 w-4" />
              <span className="text-sm font-medium">
                {new Date().toLocaleTimeString('en-GB', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-2xl font-bold text-emergency-600">{sosAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-emergency-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread Notifications</p>
                <p className="text-2xl font-bold text-blue-600">{notifications}</p>
              </div>
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connection</p>
                <p className={`text-2xl font-bold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
                  {isOnline ? 'Strong' : 'Offline'}
                </p>
              </div>
              {isOnline ? (
                <Wifi className="h-8 w-8 text-green-500" />
              ) : (
                <WifiOff className="h-8 w-8 text-red-500" />
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.path}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <FeatureCard
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => navigate(feature.path)}
              status={feature.status}
              badge={feature.badge}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Emergency Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-3">
            <WifiOff className="h-6 w-6 text-red-600" />
            <div>
              <h3 className="font-semibold text-red-800">Offline Mode Active</h3>
              <p className="text-sm text-red-600">
                Some features may be limited. Messages and alerts will be queued until connection is restored.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Dashboard;
