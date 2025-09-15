import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import ModalPreview from './ModalPreview';
import './CalendarView.css';

function CalendarView({ assignments, onUpdateAssignment }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const events = assignments.map(a=>{
    const startDate = a.dueDate ? new Date(a.dueDate.year,a.dueDate.month-1,a.dueDate.day) : new Date();
    return {
      id: a.id,
      title: a.title,
      date: startDate.toISOString().split('T')[0],
      extendedProps: { assignment: a },
      color: a.status==='missing'?'#f8d7da':a.status==='upcoming'?'#d4edda':'#fff3cd'
    };
  });

  const handleEventClick = info => {
    const a = info.event.extendedProps.assignment;
    if(a.materials && a.materials.length>0){
      const file = a.materials.find(m=>m.driveFile);
      if(file) { setSelectedFile(file.driveFile); setModalOpen(true); }
    }
  };

  const handleEventDrop = info => {
    const newDate = new Date(info.event.start);
    const a = info.event.extendedProps.assignment;
    a.dueDate = { year: newDate.getFullYear(), month: newDate.getMonth()+1, day: newDate.getDate() };
    onUpdateAssignment(a);
  };

  return (
    <div className="calendar-container">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        editable={true}
        events={events}
        eventClick={handleEventClick}
        eventDrop={handleEventDrop}
      />
      <ModalPreview isOpen={modalOpen} onRequestClose={()=>setModalOpen(false)} file={selectedFile} />
    </div>
  );
}

export default CalendarView;
