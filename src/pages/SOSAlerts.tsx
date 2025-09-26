import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, MapPin, Clock, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { SOSAlert } from '../types';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SOSAlerts: React.FC = () => {
  const [alerts, setAlerts] = useState<SOSAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newAlert, setNewAlert] = useState({
    message: '',
    priority: 'high' as const
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const response = await apiService.getSOSAlerts();
      if (response.success) {
        setAlerts(response.data || []);
      }
    } catch (error) {
      console.error('Failed to load SOS alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Get current location
      let location = {
        lat: 51.5074,
        lng: -0.1278,
        address: 'London, UK'
      };

      if (navigator.geolocation) {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });
        location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }

      const response = await apiService.createSOSAlert(newAlert.message, location);
      if (response.success) {
        setAlerts(prev => [response.data!, ...prev]);
        setNewAlert({ message: '', priority: 'high' });
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('Failed to create SOS alert:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">SOS Alerts</h1>
          <p className="text-gray-600">Manage emergency alerts and incidents</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowCreateForm(true)}
          className="mt-4 lg:mt-0 bg-emergency-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-emergency-600 transition-colors flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Create SOS Alert</span>
        </motion.button>
      </div>

      {/* Create Alert Modal */}
      {showCreateForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Create SOS Alert</h3>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={createAlert} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emergency Message
                </label>
                <textarea
                  value={newAlert.message}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, message: e.target.value }))}
                  required
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                  placeholder="Describe the emergency situation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority Level
                </label>
                <select
                  value={newAlert.priority}
                  onChange={(e) => setNewAlert(prev => ({ ...prev, priority: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emergency-500 focus:border-emergency-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 bg-emergency-500 text-white px-4 py-2 rounded-lg hover:bg-emergency-600 transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {submitting ? (
                    <LoadingSpinner size="sm" color="text-white" />
                  ) : (
                    'Send Alert'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No SOS Alerts</h3>
            <p className="text-gray-600">You haven&apos;t created any emergency alerts yet.</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-lg border-l-4 ${
                alert.status === 'active' ? 'border-red-500' : 'border-green-500'
              } shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(alert.priority)}`}>
                        {alert.priority.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(alert.status)}`}>
                        {alert.status.toUpperCase()}
                      </span>
                    </div>
                    
                    <p className="text-gray-900 font-medium mb-2">{alert.message}</p>
                    
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-sm text-gray-600 space-y-1 sm:space-y-0">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(alert.createdAt).toLocaleDateString('en-GB')}</span>
                        <span>{new Date(alert.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {alert.location.address || 
                           `${alert.location.lat.toFixed(4)}, ${alert.location.lng.toFixed(4)}`}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {alert.status === 'active' && (
                    <div className="mt-4 lg:mt-0 lg:ml-6">
                      <button className="flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 transition-colors">
                        <CheckCircle className="h-4 w-4" />
                        <span>Mark Resolved</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default SOSAlerts;
