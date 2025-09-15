import React from 'react';
import './AssignmentCard.css';

function AssignmentCard({ assignment }) {
  const { title, dueDate, materials, courseName, status } = assignment;
  const dueString = dueDate ? `${dueDate.year}-${dueDate.month}-${dueDate.day}` : 'No due date';
  const cardColor = status==='missing'?'#f8d7da':status==='upcoming'?'#d4edda':'#fff3cd';

  return (
    <div className="assignment-card" style={{ backgroundColor: cardColor }}>
      <h2>{title}</h2>
      <p><strong>Course:</strong> {courseName}</p>
      <p><strong>Due:</strong> {dueString}</p>
      {materials && materials.map((m, idx)=> m.driveFile &&
        <div key={idx} className="iframe-container">
          <p>{m.driveFile.title}</p>
          <iframe title={m.driveFile.title} src={`https://docs.google.com/${m.driveFile.driveFileId}/preview`} width="100%" height="300"></iframe>
        </div>
      )}
    </div>
  );
}

export default AssignmentCard;
