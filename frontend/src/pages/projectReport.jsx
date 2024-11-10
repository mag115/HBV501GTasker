import React, { useEffect, useState } from 'react';
import { request } from '../api/http';
import { Page } from '../components/page';
import { useAuth } from '../context/auth-context';
import { TasksReport } from '../components/tasks-report';
import CustomReportDialog from '../components/CustomReportDialog';

const ProjectReportPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { auth } = useAuth();
  const [tasks, setTasks] = useState([]);

  // State for custom report dialog
  const [isCustomReportModalOpen, setIsCustomReportModalOpen] = useState(false);
  const [reportOptions, setReportOptions] = useState({
    includeTasks: true,
    includeTimeSpent: true,
    includePerformance: true,
    // Add more options as needed
  });

  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await request('get', '/reports');
         const response2=await request('get', '/tasks');
                setReports(response.data);
                setTasks(response2.data);
      } catch (err) {
        console.error('Error fetching reports:', err);
        setError('Failed to load project reports.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleCreateReport = async () => {
    try {
      setLoading(true);
      const response = await request('post', '/reports/generate');
      alert('Project report created successfully!');
      setReports((prevReports) => [...prevReports, response.data]);
    } catch (err) {
      console.error('Error creating report:', err);
      setError('Failed to create project report.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (reportId) => {
    try {
      const response = await fetch(`/reports/${reportId}/export`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
          'Authorization': `Bearer ${auth.token}`, // Pass the auth token
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

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

  const handleOpenCustomReportDialog = () => {
    setIsCustomReportModalOpen(true);
  };

  const handleCloseCustomReportDialog = () => {
    setIsCustomReportModalOpen(false);
  };

  const handleReportOptionChange = (e) => {
    const { name, checked } = e.target;
    setReportOptions((prevOptions) => ({
        ...prevOptions,
        [name]: checked,
    }));
  };

  const handleGenerateCustomReport = async () => {
    try {
        setLoading(true);
        const response = await request('post', '/reports/generate/custom', reportOptions);
        alert('Custom project report created successfully!');
        setReports((prevReports) => [...prevReports, response.data]);
        setIsCustomReportModalOpen(false);
    } catch (err) {
        console.error('Error creating custom report:', err);
        setError('Failed to create custom project report.');
    } finally {
        setLoading(false);
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
        <button
            onClick={handleOpenCustomReportDialog}
            className="bg-white hover:bg-green-600 text-black font-semibold py-2 px-4 rounded"
        >
            Generate Custom Report
        </button>
      </div>
      {/* Include the customizedReportDialog component */}
      <CustomReportDialog
        isOpen={isCustomReportModalOpen}
        onRequestClose={handleCloseCustomReportDialog}
        onGenerateReport={handleGenerateCustomReport}
        reportOptions={reportOptions}
        onOptionChange={handleReportOptionChange}
      />
      {/* Rest of your component */}
      {reports.length === 0 ? (
        <p className="text-center">No project reports available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reports.map((report) => (
            <div
              key={report.id}
             className="rounded overflow-hidden shadow-lg bg-white m-4 p-4"
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
                < TasksReport />
              <button
                onClick={() => handleDownloadReport(report.id)}
                className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded mt-4"
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
