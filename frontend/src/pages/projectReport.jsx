import React, { useEffect, useState } from 'react';
import { request } from '../api/http';
import { Page } from '../components/page';

const ProjectReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch project reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await request('get', '/reports');
        setReports(response.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load project reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Handle creating a new project report
  const handleCreateReport = async () => {
    try {
      setLoading(true);
      const response = await request('post', '/reports/generate');
      alert('Project report created successfully!');
      // Refresh the report list after creation
      setReports((prevReports) => [...prevReports, response.data]);
    } catch (err) {
      console.error('Error creating report:', err);
      setError('Failed to create project report.');
    } finally {
      setLoading(false);
    }
  };

  // Handle downloading the report as a PDF
  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetch(`/projects/${reportId}/report/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      // Create a blob and download the file
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `project_report_${reportId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Error downloading report:', err);
      setError('Failed to download project report.');
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <Page>
      <h1 className="text-2xl font-bold text-center mb-6 text-white">
        Project Reports
      </h1>
      <div className="text-center mb-6">
        <button
          onClick={handleCreateReport}
          className="bg-white hover:bg-blue-600 text-black font-semibold py-2 px-4 rounded"
        >
          Create Project Report
        </button>
      </div>
      {reports.length === 0 ? (
        <p className="text-center">No project reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4 p-4"
            >
              <h2 className="font-bold text-xl mb-2">Report #{report.id}</h2>
              <p className="text-gray-700">
                Report Date: {new Date(report.reportDate).toLocaleDateString()}
              </p>
              <p className="text-gray-700">
                Total Time Spent: {report.totalTimeSpent} hours
              </p>
              <p className="text-gray-700">
                Overall Performance: {report.overallPerformance}
              </p>
              <button
                onClick={() => handleDownloadReport(report.id)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Download PDF
              </button>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
};


export { ProjectReportPage };
