const reportModel = require('../models/reportModel');
const cloudinary = require('../config/cloudinary');

// API: Ambil semua data laporan (Untuk Dashboard & Peta)
const getReportsAPI = async (req, res) => {
  try {
    const data = await reportModel.getAllReports();
    
    // MySQL mengembalikan lat/lng sebagai string/decimal, kita format ulang
    // agar sesuai dengan kebutuhan peta Leaflet.js [lat, lng]
    const formattedData = data.map(row => ({
      id: row.id,
      jenis: row.jenis,
      deskripsi: row.deskripsi,
      koordinat: [parseFloat(row.lat), parseFloat(row.lng)],
      foto: row.foto,
      status: row.status,
      tanggal: row.tanggal
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    console.error("Error get data:", error);
    res.status(500).json({ success: false, message: 'Gagal mengambil data laporan dari database.' });
  }
};

// API: Simpan laporan baru dari warga
const createReportAPI = async (req, res) => {
  try {
    const { jenis, deskripsi, lat, lng } = req.body;
    let fotoPath = null;

if (req.file) {
  const uploadResult = await uploadToCloudinary(req.file.buffer);
  fotoPath = uploadResult.secure_url;
}

    // Siapkan objek data
    const newReport = {
      id: `SR-${Date.now()}`,
      jenis: jenis,
      deskripsi: deskripsi,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      foto: fotoPath,
      status: 'Menunggu',
      tanggal: new Date().toISOString().slice(0, 19).replace('T', ' ') // Format MySQL DATETIME
    };

    // 1. Simpan ke database terlebih dahulu
    await reportModel.addReport(newReport);
    
    // =========================================================
    // 2. KODE SOCKET.IO DITARUH DI SINI
    // =========================================================
    const io = req.app.get('io');
    io.emit('laporan_baru', {
      id: newReport.id,
      pesan: 'Ada aduan masyarakat baru yang masuk!',
      jenis: jenis, // Mengambil langsung dari variabel input di atas
      waktu: new Date().toLocaleTimeString('id-ID')
    });
    // =========================================================

    // 3. Kirim respon berhasil ke warga
    res.status(201).json({ success: true, message: 'Laporan berhasil dikirim ke database!' });
  } catch (error) {
    console.error("Error insert data:", error);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan saat menyimpan laporan ke database.' });
  }
};

// API: Update status laporan
const updateStatusAPI = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    await reportModel.updateStatus(id, status);
    res.status(200).json({ success: true, message: 'Status berhasil diperbarui!' });
  } catch (error) {
    console.error("Error update status:", error);
    res.status(500).json({ success: false, message: 'Gagal memperbarui status.' });
  }
};

// API: Hapus laporan
const deleteReportAPI = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await reportModel.deleteReport(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'Laporan tidak ditemukan.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Laporan berhasil dihapus!'
    });
  } catch (error) {
    console.error("Error delete laporan:", error);
    res.status(500).json({
      success: false,
      message: 'Gagal menghapus laporan.'
    });
  }
};

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'smartroad/laporan',
        resource_type: 'image'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  getReportsAPI,
  createReportAPI,
  updateStatusAPI,
  deleteReportAPI
};