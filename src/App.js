import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

const App = () => {
  const [postData, setPostData] = useState('');
  const [response, setResponse] = useState('');
  const [error, setError] = useState('');
  const [allData, setAllData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post('http://localhost:8080/api/data/save', { data: postData }, {
                headers: {
                    'Content-Type': 'application/json', // Use JSON as the content type
                },
            });

            setResponse(res.data);
            setError('');
            setPostData('');
            fetchData();
        } catch (error) {
            console.error('Error submitting data:', error);
            setResponse('');
            setError('Error submitting data');
        }
    };


    const fetchData = async () => {
      const res = await axios.get('http://localhost:8080/api/data/getAll');

      // Sort the data by id before updating the state
      const sortedData = res.data.sort((a, b) => a.id - b.id);

      setAllData(sortedData);
  };

  const handleEditClick = (id, data) => {
    setEditingId(id);
    setEditData(data);
  };

  const handleUpdate = async (id, newData) => {
      console.log('Updating data with ID:', id);
      const res = await axios.put(`http://localhost:8080/api/data/update/${id}`, { data: newData }, {
        headers: {
            'Content-Type': 'application/json', // Use JSON as the content type
        },
      });

      console.log('Update response:', res);
      fetchData();
      setEditingId(null);
      setEditData('');
  };

  const handleDelete = async (id) => {
      console.log('Deleting data with ID:', id);
      const res = await axios.delete(`http://localhost:8080/api/data/delete/${id}`);
      console.log('Delete response:', res);
      fetchData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
      <div className="app-container">
        <form onSubmit={handleSubmit} className="form-container">
          <label>
            Enter Text:
            <input
                type="text"
                value={postData}
                onChange={(e) => setPostData(e.target.value)}
            />
          </label>
          <button type="submit">Submit</button>
        </form>

        <div className="data-container">
          <p>All Texts:</p>
          <ul>
            {allData.map((item) => (
                <li key={item.id} className={`data-item ${editingId === item.id ? 'editing' : ''}`}>
                  {editingId === item.id ? (
                      <div className="edit-form">
                        <input
                            type="text"
                            value={editData}
                            onChange={(e) => setEditData(e.target.value)}
                        />
                        <button
                            className="update-button"
                            onClick={() => handleUpdate(item.id, editData)}
                        >
                          Update
                        </button>
                      </div>
                  ) : (
                      <>
                        <span>{item.data}</span>
                        <div className="buttons-container">
                          <button
                              className="edit-button"
                              onClick={() => handleEditClick(item.id, item.data)}
                          >
                            Edit
                          </button>
                          <button
                              className="delete-button"
                              onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </>
                  )}
                </li>
            ))}
          </ul>
        </div>
      </div>
  );
};

export default App;
