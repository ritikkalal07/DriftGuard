import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { reportsAPI } from '../services/api';
import { FileText, Filter, ExternalLink } from 'lucide-react';
import { formatDateTime, getDriftStatusColor, getDriftStatusIcon } from '../utils/helpers';
import toast from 'react-hot-toast';

const ReportsPage = () => {
  const [searchParams] = useSearchParams();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    driftStatus: searchParams.get('driftStatus') || '',
    status: searchParams.get('status') || '',
  });

  useEffect(() => {
    fetchReports();
  }, [filter]);

  const fetchReports = async () => {
    try {
      const params = {};
      if (filter.driftStatus) params.driftStatus = filter.driftStatus;
      if (filter.status) params.status = filter.status;

      const response = await reportsAPI.getAll(params);
      if (response.success) {
        setReports(response.data.reports);
      }
    } catch (error) {
      toast.error('Failed to load reports');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drift Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Review and manage documentation drift issues
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={filter.driftStatus}
            onChange={(e) => setFilter({ ...filter, driftStatus: e.target.value })}
            className="input"
          >
            <option value="">All Drift Status</option>
            <option value="high">High Drift</option>
            <option value="possible">Possible Drift</option>
            <option value="missing">Missing Docs</option>
            <option value="none">No Drift</option>
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
            className="input"
          >
            <option value="">All Status</option>
            <option value="unresolved">Unresolved</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Reports List */}
      {reports.length === 0 ? (
        <div className="card p-12 text-center">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No reports found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Run a scan to detect documentation drift
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <Link
              key={report.id}
              to={`/reports/${report.id}`}
              className="card p-6 block hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className={`badge ${getDriftStatusColor(report.drift_status)}`}>
                      {getDriftStatusIcon(report.drift_status)} {report.drift_status}
                    </span>
                    <span className="text-sm text-gray-500">
                      Severity: {report.severity_score}/100
                    </span>
                    <span className="text-sm text-gray-500">
                      Confidence: {report.confidence_score}/100
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {report.changed_file}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {report.explanation}
                  </p>
                  <div className="flex items-center mt-3 space-x-4 text-sm text-gray-500">
                    <span>{report.projectId?.name}</span>
                    <span>•</span>
                    <span>{formatDateTime(report.created_at)}</span>
                    {report.changed_symbols?.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{report.changed_symbols.length} symbols changed</span>
                      </>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-gray-400" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReportsPage;

// Made with Bob
