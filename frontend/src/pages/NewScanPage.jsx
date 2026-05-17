import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { projectsAPI, scansAPI } from '../services/api';
import { ScanSearch, Upload, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

const NewScanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(location.state?.projectId || '');
  const [diffContent, setDiffContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectsAPI.getAll();
      if (response.success) {
        setProjects(response.data.projects);
      }
    } catch (error) {
      toast.error('Failed to load projects');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedProject) {
      toast.error('Please select a project');
      return;
    }

    if (!diffContent.trim()) {
      toast.error('Please provide diff content');
      return;
    }

    setLoading(true);

    try {
      const response = await scansAPI.create({
        projectId: selectedProject,
        diffContent: diffContent,
      });

      if (response.success) {
        toast.success('Scan started! Processing...');
        navigate(`/reports?scanId=${response.data.scan.id}`);
      }
    } catch (error) {
      toast.error('Failed to create scan');
    } finally {
      setLoading(false);
    }
  };

  const sampleDiff = `diff --git a/src/api/userController.js b/src/api/userController.js
index 1234567..abcdefg 100644
--- a/src/api/userController.js
+++ b/src/api/userController.js
@@ -10,7 +10,9 @@ export const getUserProfile = async (req, res) => {
     const user = await User.findById(userId);
     res.json({
       id: user.id,
       name: user.name,
-      email: user.email
+      email: user.email,
+      avatar: user.avatar,
+      role: user.role
     });
   } catch (error) {
     res.status(500).json({ error: error.message });`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">New Scan</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Analyze code changes for documentation drift
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <div className="card p-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Project *
          </label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="input"
            required
          >
            <option value="">Choose a project...</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {projects.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No projects found. Create a project first.
            </p>
          )}
        </div>

        {/* Diff Content */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Git Diff Content *
            </label>
            <button
              type="button"
              onClick={() => setDiffContent(sampleDiff)}
              className="text-sm text-primary-600 hover:text-primary-700"
            >
              Use Sample Diff
            </button>
          </div>
          <textarea
            value={diffContent}
            onChange={(e) => setDiffContent(e.target.value)}
            className="input font-mono text-sm"
            rows="15"
            placeholder="Paste your git diff here..."
            required
          />
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300 font-medium mb-2">
              💡 How to get a git diff:
            </p>
            <div className="space-y-1 text-sm text-blue-700 dark:text-blue-400">
              <p>• Uncommitted changes: <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">git diff {'>'} changes.diff</code></p>
              <p>• Between commits: <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">git diff commit1 commit2</code></p>
              <p>• Last commit: <code className="bg-blue-100 dark:bg-blue-900/40 px-2 py-0.5 rounded">git show HEAD</code></p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary flex-1 flex items-center justify-center"
          >
            {loading ? (
              <div className="spinner w-5 h-5 border-2"></div>
            ) : (
              <>
                <ScanSearch className="w-5 h-5 mr-2" />
                Start Scan
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-secondary"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card p-4">
          <Upload className="w-8 h-8 text-primary-600 mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">Upload Diff</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Paste git diff content directly
          </p>
        </div>
        <div className="card p-4">
          <ScanSearch className="w-8 h-8 text-blue-600 mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">AI Analysis</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Intelligent drift detection
          </p>
        </div>
        <div className="card p-4">
          <FileText className="w-8 h-8 text-green-600 mb-2" />
          <h3 className="font-medium text-gray-900 dark:text-white mb-1">Get Reports</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Detailed drift analysis
          </p>
        </div>
      </div>
    </div>
  );
};

export default NewScanPage;

// Made with Bob
