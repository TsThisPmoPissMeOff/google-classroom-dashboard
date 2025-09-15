import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

function ModalPreview({ isOpen, onRequestClose, file }) {
  if (!file) return null;
  const url = `https://docs.google.com/${file.driveFileId}/preview`;
  
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={{
      content: { top:'50%', left:'50%', right:'auto', bottom:'auto', transform:'translate(-50%, -50%)', width:'80%', height:'80%' }
    }}>
      <button onClick={onRequestClose} style={{ marginBottom:'10px'}}>Close</button>
      <iframe title={file.title} src={url} width="100%" height="100%"></iframe>
    </Modal>
  );
}

export default ModalPreview;
