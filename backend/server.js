const express = require('express');
const { google } = require('googleapis');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

const oauth2Client = new google.auth.OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let tokens = null;

app.get('/login', (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/classroom.coursework.me.readonly',
      'https://www.googleapis.com/auth/classroom.courses.readonly',
      'https://www.googleapis.com/auth/drive.readonly'
    ]
  });
  res.redirect(url);
});

app.get('/oauth2callback', async (req, res) => {
  const code = req.query.code;
  const { tokens: t } = await oauth2Client.getToken(code);
  tokens = t;
  oauth2Client.setCredentials(tokens);
  res.redirect(process.env.FRONTEND_URL || 'http://localhost:3000');
});

app.get('/refresh-assignments', async (req, res) => {
  if(!tokens) return res.status(401).send('Not authenticated');
  oauth2Client.setCredentials(tokens);

  const classroom = google.classroom({ version: 'v1', auth: oauth2Client });
  const coursesRes = await classroom.courses.list();
  const courses = coursesRes.data.courses || [];
  const assignments = [];
  const now = new Date();

  for (const course of courses) {
    const workRes = await classroom.courses.courseWork.list({ courseId: course.id });
    const courseWorks = workRes.data.courseWork || [];
    for (const cw of courseWorks) {
      cw.courseName = course.name;
      if(cw.dueDate){
        const due = new Date(cw.dueDate.year,cw.dueDate.month-1,cw.dueDate.day);
        cw.status = due < now ? 'missing' : 'upcoming';
      } else {
        cw.status = 'no due date';
      }
      assignments.push(cw);
    }
  }

  assignments.sort((a,b)=> a.status==='upcoming'? -1 :1);
  res.json(assignments);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log(`Backend running on port ${PORT}`));
