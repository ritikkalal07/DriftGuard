import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import { 
  ScanSearch, 
  AlertTriangle, 
  FileQuestion, 
  CheckCircle2,
  TrendingUp,
  Clock,
  ArrowRight
} from 'lucide-react';
import { formatDateTime, getDriftStatusColor, getDriftStatusIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentScans, setRecentScans] = useState([]);
  const [highPriorityReports, setHighPriorityReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      if (response.success) {
        setStats(response.data.stats);
        setRecentScans(response.data.recentScans || []);
        setHighPriorityReports(response.data.highPriorityReports || []);
      }
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Scans',
      value: stats?.totalScans || 0,
      icon: ScanSearch,
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'High Drift Files',
      value: stats?.highDriftFiles || 0,
      icon: AlertTriangle,
      color: 'bg-red-500',
      textColor: 'text-red-600',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
    {
      title: 'Missing Docs',
      value: stats?.missingDocs || 0,
      icon: FileQuestion,
      color: 'bg-purple-500',
      textColor: 'text-purple-600',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    },
    {
      title: 'Resolved',
      value: stats?.resolvedReports || 0,
      icon: CheckCircle2,
      color: 'bg-green-500',
      textColor: 'text-green-600',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Overview of your documentation drift detection
          </p>
        </div>
        <Link to="/scan/new" className="btn btn-primary">
          <ScanSearch className="w-5 h-5 mr-2" />
          New Scan
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Scans */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Scans
            </h2>
            <Link
              to="/reports"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {recentScans.length === 0 ? (
            <div className="text-center py-8">
              <ScanSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No scans yet</p>
              <Link to="/scan/new" className="text-primary-600 hover:text-primary-700 text-sm mt-2 inline-block">
                Create your first scan
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan._id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {scan.projectId?.name || 'Unknown Project'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {formatDateTime(scan.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {scan.status === 'completed' && (
                      <span className="badge badge-none">
                        {scan.summary?.highDriftCount || 0} high
                      </span>
                    )}
                    <span className={`badge ${scan.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {scan.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* High Priority Reports */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              High Priority Issues
            </h2>
            <Link
              to="/reports?status=unresolved"
              className="text-sm text-primary-600 hover:text-primary-700 flex items-center"
            >
              View all
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {highPriorityReports.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
              <p className="text-gray-600 dark:text-gray-400">No high priority issues</p>
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">
                Your documentation is in good shape!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {highPriorityReports.slice(0, 5).map((report) => (
                <Link
                  key={report._id}
                  to={`/reports/${report._id}`}
                  className="block p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {report.changedFile}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                        {report.explanation}
                      </p>
                    </div>
                    <span className={`badge ml-2 ${getDriftStatusColor(report.driftStatus)}`}>
                      {getDriftStatusIcon(report.driftStatus)} {report.driftStatus}
                    </span>
                  </div>
                  <div className="flex items-center mt-2 space-x-2">
                    <span className="text-xs text-gray-500">
                      Severity: {report.severityScore}/100
                    </span>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500">
                      {report.projectId?.name}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/scan/new"
            className="flex items-center p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            <ScanSearch className="w-8 h-8 text-primary-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">New Scan</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Analyze code changes</p>
            </div>
          </Link>

          <Link
            to="/projects"
            className="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
          >
            <TrendingUp className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View Projects</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Manage repositories</p>
            </div>
          </Link>

          <Link
            to="/reports"
            className="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
          >
            <AlertTriangle className="w-8 h-8 text-purple-600 mr-3" />
            <div>
              <p className="font-medium text-gray-900 dark:text-white">View Reports</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Review drift issues</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

// Made with Bob
