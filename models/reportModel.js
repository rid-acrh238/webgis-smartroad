const db = require('../config/db');

module.exports = {
  // Mengambil semua data dari database
  getAllReports: async () => {
    const [rows] = await db.query('SELECT * FROM laporan ORDER BY tanggal DESC');
    return rows;
  },

  // Menyimpan data baru ke database
  addReport: async (data) => {
    const query = `
      INSERT INTO laporan (id, jenis, deskripsi, lat, lng, foto, status, tanggal)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.id,
      data.jenis,
      data.deskripsi,
      data.lat,
      data.lng,
      data.foto,
      data.status,
      data.tanggal
    ];

    const [result] = await db.query(query, values);
    return result;
  },

  // Memperbarui status laporan
  updateStatus: async (id, status) => {
    const query = 'UPDATE laporan SET status = ? WHERE id = ?';
    const [result] = await db.query(query, [status, id]);
    return result;
  },

  // Menghapus laporan
  deleteReport: async (id) => {
    const query = 'DELETE FROM laporan WHERE id = ?';
    const [result] = await db.query(query, [id]);
    return result;
  }
};