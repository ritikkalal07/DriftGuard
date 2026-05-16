import { useState, useEffect } from 'react';
import { settingsAPI } from '../services/api';
import { Settings as SettingsIcon, Save, TestTube } from 'lucide-react';
import toast from 'react-hot-toast';

const SettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.success) {
        setSettings(response.data.settings);
      }
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await settingsAPI.update(settings);
      if (response.success) {
        toast.success('Settings saved successfully');
      }
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleTestAI = async () => {
    setTesting(true);
    try {
      const response = await settingsAPI.testAI();
      if (response.success) {
        toast.success('AI provider is working correctly!');
      }
    } catch (error) {
      toast.error('AI provider test failed');
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Configure your DriftGuard preferences
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* AI Provider */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <SettingsIcon className="w-5 h-5 mr-2" />
            AI Provider
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Provider Type
              </label>
              <select
                value={settings?.aiProvider || 'mock'}
                onChange={(e) => setSettings({ ...settings, aiProvider: e.target.value })}
                className="input"
              >
                <option value="mock">Mock AI (No API Key Required)</option>
                <option value="watsonx">IBM watsonx Code Assistant</option>
                <option value="openai">OpenAI</option>
                <option value="custom">Custom Endpoint</option>
              </select>
              <p className="text-sm text-gray-500 mt-2">
                Mock AI provider works without any API keys and provides realistic results
              </p>
            </div>

            {settings?.aiProvider !== 'mock' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={settings?.apiKey || ''}
                    onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                    className="input"
                    placeholder="Enter your API key"
                  />
                </div>

                {settings?.aiProvider === 'custom' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      API Endpoint
                    </label>
                    <input
                      type="url"
                      value={settings?.apiEndpoint || ''}
                      onChange={(e) => setSettings({ ...settings, apiEndpoint: e.target.value })}
                      className="input"
                      placeholder="https://your-ai-service.com/api"
                    />
                  </div>
                )}
              </>
            )}

            <button
              type="button"
              onClick={handleTestAI}
              disabled={testing}
              className="btn btn-secondary"
            >
              {testing ? (
                <div className="spinner w-4 h-4 border-2 mr-2"></div>
              ) : (
                <TestTube className="w-4 h-4 mr-2" />
              )}
              Test AI Connection
            </button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Preferences
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Theme</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Choose your interface theme</p>
              </div>
              <select
                value={settings?.preferences?.theme || 'light'}
                onChange={(e) => setSettings({
                  ...settings,
                  preferences: { ...settings.preferences, theme: e.target.value }
                })}
                className="input w-40"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Notifications</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Receive scan completion notifications</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.preferences?.notifications || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, notifications: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between py-3 border-t border-gray-200 dark:border-gray-700">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">Auto-approve Low Severity</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve suggestions with low severity</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings?.preferences?.autoApprove || false}
                  onChange={(e) => setSettings({
                    ...settings,
                    preferences: { ...settings.preferences, autoApprove: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary"
          >
            {saving ? (
              <div className="spinner w-5 h-5 border-2 mr-2"></div>
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Save Settings
          </button>
        </div>
      </form>

      {/* Info */}
      <div className="card p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
          💡 About Mock AI Provider
        </h3>
        <p className="text-sm text-blue-800 dark:text-blue-400">
          The Mock AI provider uses intelligent heuristics to detect documentation drift without requiring any external API keys. 
          It provides realistic results and is perfect for demos and testing. For production use with real AI models, 
          configure IBM watsonx Code Assistant or OpenAI.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;

// Made with Bob
