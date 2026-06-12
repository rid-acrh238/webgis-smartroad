require('dotenv').config();

const express = require('express');
const path = require('path');

const viewRoutes = require('./routes/viewRoutes');
const apiRoutes = require('./routes/apiRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy io untuk Vercel, supaya controller tidak error
app.set('io', {
  emit: () => {}
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', viewRoutes);
app.use('/api', apiRoutes);

// Socket.io hanya jalan saat lokal, bukan di Vercel
if (!process.env.VERCEL) {
  const http = require('http');
  const { Server } = require('socket.io');

  const server = http.createServer(app);
  const io = new Server(server);

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Sebuah client terhubung ke Socket.io');

    socket.on('disconnect', () => {
      console.log('Client terputus');
    });
  });

  server.listen(PORT, () => {
    console.log(`Server & Socket.io berjalan di port ${PORT}`);
  });
}

module.exports = app;

// require('dotenv').config();
// const express = require('express');
// const path = require('path');
// const http = require('http');
// const { Server } = require('socket.io');

// // Import Routes
// const viewRoutes = require('./routes/viewRoutes');
// const apiRoutes = require('./routes/apiRoutes');

// const app = express();
// const PORT = 3000;

// const server = http.createServer(app);
// const io = new Server(server);

// app.set('io', io);
// io.on('connection', (socket) => {
//   console.log('Sebuah client terhubung ke Socket.io');
  
//   socket.on('disconnect', () => {
//     console.log('Client terputus');
//   });
// });

// // Middlewares Dasar
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Serve File Statis (CSS, HTML, Images)
// app.use(express.static(path.join(__dirname, 'public')));

// // Gunakan Routes
// app.use('/', viewRoutes);
// app.use('/api', apiRoutes);

// // Jalankan Server

// server.listen(PORT, () => {
//   console.log(`Server & Socket.io berjalan di port ${PORT}`);
// });


