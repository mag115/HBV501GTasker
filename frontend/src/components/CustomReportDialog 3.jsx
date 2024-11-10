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
      <h2>Select Report Options</h2>
      <form>
        <label>
          <input
            type="checkbox"
            name="includeTasks"
            checked={reportOptions.includeTasks}
            onChange={onOptionChange}
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
          />
          Include Overall Performance
        </label>
        {/* Add more options as needed */}
        <br />
        <button type="button" onClick={onGenerateReport}>
          Generate Report
        </button>
        <button type="button" onClick={onRequestClose}>
          Cancel
        </button>
      </form>
    </Modal>
  );
};

export default CustomReportDialog;
