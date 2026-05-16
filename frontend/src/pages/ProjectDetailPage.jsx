import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projectsAPI } from '../services/api';
import { ArrowLeft, ScanSearch, TrendingUp } from 'lucide-react';
import { formatDateTime } from '../utils/helpers';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [scans, setScans] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, scansRes] = await Promise.all([
        projectsAPI.getById(id),
        projectsAPI.getScans(id),
      ]);

      if (projectRes.success) {
        setProject(projectRes.data.project);
        setStats(projectRes.data.stats);
      }
      if (scansRes.success) {
        setScans(scansRes.data.scans);
      }
    } catch (error) {
      toast.error('Failed to load project');
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

  if (!project) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Project not found</p>
        <Link to="/projects" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link to="/projects" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
          </div>
          <Link to="/scan/new" state={{ projectId: project._id }} className="btn btn-primary">
            <ScanSearch className="w-5 h-5 mr-2" />
            New Scan
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Scans</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
            {stats?.totalReports || 0}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">High Drift</p>
          <p className="text-2xl font-bold text-red-600 mt-2">
            {stats?.highDriftCount || 0}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Missing Docs</p>
          <p className="text-2xl font-bold text-purple-600 mt-2">
            {stats?.missingDocsCount || 0}
          </p>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">Unresolved</p>
          <p className="text-2xl font-bold text-yellow-600 mt-2">
            {stats?.unresolvedCount || 0}
          </p>
        </div>
      </div>

      {/* Recent Scans */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2" />
          Recent Scans
        </h2>
        {scans.length === 0 ? (
          <div className="text-center py-8">
            <ScanSearch className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 dark:text-gray-400">No scans yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {scans.map((scan) => (
              <div key={scan._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Scan #{scan._id.slice(-6)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDateTime(scan.createdAt)}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  {scan.summary && (
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {scan.summary.highDriftCount} high • {scan.summary.missingDocsCount} missing
                    </div>
                  )}
                  <span className={`badge ${scan.status === 'completed' ? 'badge-none' : 'bg-yellow-100 text-yellow-800'}`}>
                    {scan.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetailPage;

// Made with Bob
