import React, { useState } from 'react';

function App() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [reminderSent, setReminderSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    const task = {
      title,
      description,
      deadline,
      reminderSent,
    };

    // Send a POST request to the backend to create the task
    fetch('http://localhost:8080/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Task created successfully:', data);
        // Clear form fields after successful submission
        setTitle('');
        setDescription('');
        setDeadline('');
        setReminderSent(false);
      })
      .catch((error) => {
        console.error('Error creating task:', error);
      });
  };

  const matti = 'sdf';

  return (
    <div className="App">
      <h1>Create a</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Deadline:</label>
          <input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Reminder Sent:</label>
          <input
            type="checkbox"
            checked={reminderSent}
            onChange={(e) => setReminderSent(e.target.checked)}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
}

export default App;
