import React from 'react';

export default function ContactItem({ contact, onDelete, onEdit }) {
  return (
    <li>
      <p>{contact.name} - {contact.email}</p>
      <button onClick={() => onEdit(contact)}>Edit</button>
      <button onClick={() => onDelete(contact.id)}>Delete</button>
    </li>
  );
}