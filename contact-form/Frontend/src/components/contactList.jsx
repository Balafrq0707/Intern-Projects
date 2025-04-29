import React, { useState } from 'react';
import EditContactForm from './EditContactForm';


function ContactList({ infoList }) {
  const [editingEntry, setEditingEntry] = useState(null);

  return (
    <div className="submitted-info">
      <h2>Submitted Information</h2>
      {infoList.length > 0 ? (
        <ul className="info-list">
          {infoList.map((entry, index) => (
            <li key={index} className="info-item">
              <div className="info-details">
                <strong>{entry.name}</strong>
                <p>Phone: {entry.mobile}</p>
                <p>Email: {entry.email}</p>
              </div>
              <button className="edit-button" onClick={() => setEditingEntry(entry)}>
                Edit
              </button>

              {editingEntry && editingEntry.name === entry.name && (
                <EditContactForm entry={editingEntry} onClose={() => setEditingEntry(null)}/>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No information submitted yet.</p>
      )}
    </div>
  );
}

export default ContactList;
