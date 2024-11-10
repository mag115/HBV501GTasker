// src/components/CustomReportDialog.jsx

import React from 'react';
import Modal from 'react-modal'; // Ensure you have installed react-modal or use any modal library you prefer

const CustomReportDialog = ({
  isOpen,
  onRequestClose,
  onGenerateReport,
  reportOptions,
  onOptionChange,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Select Report Options"
      ariaHideApp={false} // Set to false if you haven't set up the root app element
    >
      <h2 className="text-indigo-600">What information do you want in your report?</h2>
      <form>
        <label>
          <input
            type="checkbox"
            name="includeTasks"
            checked={reportOptions.includeTasks}
            onChange={onOptionChange}
            className="m-2"
          />
          Include Tasks
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="includeTimeSpent"
            checked={reportOptions.includeTimeSpent}
            onChange={onOptionChange}
             className="m-2"
          />
          Include Total Time Spent
        </label>
        <br />
        <label>
          <input
            type="checkbox"
            name="includePerformance"
            checked={reportOptions.includePerformance}
            onChange={onOptionChange}
             className="m-2"
          />
          Include Overall Performance
        </label>
        {/* Add more options as needed */}
        <br />
        <button type="button" className="bg-indigo-600 text-white m-2 ml-0 px-4 py-2 rounded-md  hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition" onClick={onGenerateReport}>
          Generate Report
        </button>
        <button type="button" className="bg-indigo-600 text-white m-2 px-4 py-2 rounded-md  hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-400 transition" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default CustomReportDialog;
