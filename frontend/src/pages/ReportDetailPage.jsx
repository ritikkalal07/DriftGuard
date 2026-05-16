import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { reportsAPI, suggestionsAPI } from '../services/api';
import { ArrowLeft, CheckCircle, XCircle, Copy, Download } from 'lucide-react';
import { formatDateTime, getDriftStatusColor, copyToClipboard, downloadFile } from '../utils/helpers';
import toast from 'react-hot-toast';

const ReportDetailPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReportData();
  }, [id]);

  const fetchReportData = async () => {
    try {
      const response = await reportsAPI.getById(id);
      if (response.success) {
        setReport(response.data.report);
        setSuggestions(response.data.suggestions || []);
      }
    } catch (error) {
      toast.error('Failed to load report');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptSuggestion = async (suggestionId) => {
    try {
      await suggestionsAPI.accept(suggestionId);
      toast.success('Suggestion accepted');
      fetchReportData();
    } catch (error) {
      toast.error('Failed to accept suggestion');
    }
  };

  const handleRejectSuggestion = async (suggestionId) => {
    try {
      await suggestionsAPI.reject(suggestionId);
      toast.success('Suggestion rejected');
      fetchReportData();
    } catch (error) {
      toast.error('Failed to reject suggestion');
    }
  };

  const handleCopyPatch = async () => {
    if (report?.suggestedPatch) {
      const success = await copyToClipboard(report.suggestedPatch);
      if (success) toast.success('Copied to clipboard');
    }
  };

  const handleDownloadPatch = () => {
    if (report?.suggestedPatch) {
      downloadFile(report.suggestedPatch, `drift-patch-${report._id}.md`, 'text/markdown');
      toast.success('Downloaded patch file');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner w-12 h-12"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Report not found</p>
        <Link to="/reports" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
          Back to Reports
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link to="/reports" className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Reports
        </Link>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{report.changedFile}</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {report.projectId?.name} • {formatDateTime(report.createdAt)}
            </p>
          </div>
          <span className={`badge text-lg ${getDriftStatusColor(report.driftStatus)}`}>
            {report.driftStatus}
          </span>
        </div>
      </div>

      {/* Scores */}
      <div className="grid grid-cols-2 gap-4">
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Severity Score</p>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.severityScore}</p>
            <p className="text-gray-500 mb-1">/100</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-red-600 h-2 rounded-full"
              style={{ width: `${report.severityScore}%` }}
            />
          </div>
        </div>
        <div className="card p-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Confidence Score</p>
          <div className="flex items-end space-x-2">
            <p className="text-3xl font-bold text-gray-900 dark:text-white">{report.confidenceScore}</p>
            <p className="text-gray-500 mb-1">/100</p>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-3">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${report.confidenceScore}%` }}
            />
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Analysis</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{report.explanation}</p>
      </div>

      {/* Changed Symbols */}
      {report.changedSymbols && report.changedSymbols.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Changed Symbols</h2>
          <div className="space-y-2">
            {report.changedSymbols.map((symbol, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <span className="badge">{symbol.type}</span>
                <code className="text-sm font-mono text-gray-900 dark:text-white">{symbol.name}</code>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Documentation */}
      {report.relatedDocs && report.relatedDocs.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Related Documentation</h2>
          <div className="space-y-2">
            {report.relatedDocs.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="badge">{doc.type}</span>
                  <code className="text-sm font-mono text-gray-900 dark:text-white">{doc.path}</code>
                </div>
                <span className="text-sm text-gray-500">Match: {doc.matchScore}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Patch */}
      {report.suggestedPatch && (
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Suggested Documentation Update</h2>
            <div className="flex space-x-2">
              <button onClick={handleCopyPatch} className="btn btn-sm btn-secondary">
                <Copy className="w-4 h-4 mr-1" />
                Copy
              </button>
              <button onClick={handleDownloadPatch} className="btn btn-sm btn-secondary">
                <Download className="w-4 h-4 mr-1" />
                Download
              </button>
            </div>
          </div>
          <pre className="code-block overflow-x-auto">{report.suggestedPatch}</pre>
        </div>
      )}

      {/* Reviewer Comment */}
      {report.reviewerComment && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">PR Reviewer Comment</h2>
          <div className="prose dark:prose-invert max-w-none">
            <pre className="whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300">{report.reviewerComment}</pre>
          </div>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Suggestions</h2>
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="badge">{suggestion.type}</span>
                  <span className={`badge ${suggestion.status === 'accepted' ? 'badge-none' : suggestion.status === 'rejected' ? 'badge-high' : 'bg-gray-100 text-gray-800'}`}>
                    {suggestion.status}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{suggestion.explanation}</p>
                {suggestion.status === 'pending' && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleAcceptSuggestion(suggestion._id)}
                      className="btn btn-sm btn-primary"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => handleRejectSuggestion(suggestion._id)}
                      className="btn btn-sm btn-danger"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportDetailPage;

// Made with Bob
