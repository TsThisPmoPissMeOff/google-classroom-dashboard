import React, { useEffect, useState } from 'react';
import AssignmentCard from './AssignmentCard';
import CalendarView from './CalendarView';
import './Dashboard.css';

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [view, setView] = useState('list');

  const fetchAssignments = () => {
    fetch('http://localhost:5000/refresh-assignments')
      .then(res=>res.json())
      .then(data=>{
        setAssignments(data);
        Notification.requestPermission();
        data.forEach(a=>{
          if(a.status==='upcoming'){
            const due = new Date(a.dueDate.year,a.dueDate.month-1,a.dueDate.day);
            if(due - new Date() < 24*60*60*1000 && Notification.permission==='granted'){
              new Notification(`Assignment due soon: ${a.title}`,{body:`Due on ${due.toDateString()}`});
            }
          }
        });
      })
      .catch(console.error);
  };

  useEffect(()=>{
    fetchAssignments();
    const interval = setInterval(fetchAssignments, 5*60*1000); // refresh every 5 mins
    return ()=>clearInterval(interval);
  }, []);

  const handleUpdateAssignment = updated => {
    setAssignments(assignments.map(a=>a.id===updated.id?updated:a));
  };

  return (
    <div className="dashboard-container">
      <a href="http://localhost:5000/login" className="login-btn">Login with Google</a>
      <div style={{ marginBottom:'15px' }}>
        <button onClick={()=>setView('list')} className="toggle-btn">List View</button>
        <button onClick={()=>setView('calendar')} className="toggle-btn">Calendar View</button>
      </div>
      {assignments.length===0 ? <p>No assignments yet. Login first.</p> :
        view==='list' ?
          <div className="assignments-grid">{assignments.map(a=><AssignmentCard key={a.id} assignment={a}/>)}</div>
          : <CalendarView assignments={assignments} onUpdateAssignment={handleUpdateAssignment} />
      }
    </div>
  );
}

export default Dashboard;
