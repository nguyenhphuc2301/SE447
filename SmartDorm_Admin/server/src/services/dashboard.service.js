import pool from "../config/db.js";

function mapBookingStatus(s) {
  return (
    { cho_duyet: "pending", da_duyet: "approved", da_huy: "rejected" }[s] ||
    "pending"
  );
}

function mapReportStatus(s) {
  return (
    {
      chua_xu_ly: "unresolved",
      dang_xu_ly: "in_progress",
      da_xu_ly: "resolved",
    }[s] || "unresolved"
  );
}

export async function getDashboardData() {
  const conn = await pool.getConnection();
  try {
    // Tổng số tòa nhà
    const [[{ total_buildings }]] = await conn.query(
      "SELECT COUNT(*) AS total_buildings FROM toa_nha"
    );

    // Tổng số phòng
    const [[{ total_rooms }]] = await conn.query(
      "SELECT COUNT(*) AS total_rooms FROM phong"
    );

    // Phòng còn trống
    const [[{ available_rooms }]] = await conn.query(
      "SELECT COUNT(*) AS available_rooms FROM phong WHERE trang_thai = 'con_trong'"
    );

    //  Phòng đã đặt / đang ở
    const [[{ occupied_rooms }]] = await conn.query(
      "SELECT COUNT(*) AS occupied_rooms FROM phong WHERE trang_thai = 'da_dat'"
    );

    // Phòng đang bảo trì
    const [[{ maintenance_rooms }]] = await conn.query(
      "SELECT COUNT(*) AS maintenance_rooms FROM phong WHERE trang_thai = 'dang_bao_tri'"
    );

    //  Phòng đang có vấn đề (Issues)
    const [[{ issues_count }]] = await conn.query(
      "SELECT COUNT(*) AS issues_count FROM phong WHERE trang_thai = 'co_van_de'"
    );

    // Booking đang chờ duyệt
    const [[{ pending_bookings }]] = await conn.query(
      "SELECT COUNT(*) AS pending_bookings FROM dat_phong WHERE trang_thai = 'cho_duyet'"
    );

    // Occupancy Rate = phòng đã đặt / tổng phòng
    const occupancyRate = total_rooms
      ? Math.round((occupied_rooms / total_rooms) * 100)
      : 0;

    // Báo cáo bảo trì gần đây (vẫn lấy từ bảng bao_cao)
    const [repRows] = await conn.query(`
      SELECT BC.id,
             BC.noi_dung AS title,
             DATE_FORMAT(BC.ngay_bao_cao, '%-m/%e/%Y') AS date,
             BC.trang_thai,
             P.so_phong,
             T.ten_toa
      FROM bao_cao BC
      JOIN phong P ON P.id = BC.phong_id
      JOIN toa_nha T ON T.id = P.toa_nha_id
      ORDER BY BC.ngay_bao_cao DESC
      LIMIT 3
    `);

    const maintenanceReports = repRows.map((r) => ({
      id: r.id,
      title: r.title,
      date: r.date,
      room: r.so_phong,
      building: r.ten_toa,
      status: mapReportStatus(r.trang_thai),
    }));

    // Booking gần đây
    const [bkRows] = await conn.query(`
      SELECT DP.id,
             ND.ho_ten  AS student_name,
             ND.email   AS student_email,
             P.so_phong AS room,
             T.ten_toa  AS building,
             DATE_FORMAT(DP.ngay_dat, '%b %e, %Y')        AS bookingDate,
             DATE_FORMAT(DP.ngay_nhan_phong, '%b %e, %Y') AS checkIn,
             DP.trang_thai
      FROM dat_phong DP
      JOIN nguoi_dung ND ON ND.id = DP.nguoi_dung_id
      JOIN phong P ON P.id = DP.phong_id
      JOIN toa_nha T ON T.id = P.toa_nha_id
      ORDER BY DP.ngay_dat DESC
      LIMIT 6
    `);

    const recentBookings = bkRows.map((b) => ({
      id: b.id,
      student: { name: b.student_name, email: b.student_email },
      room: `Room ${b.room}`,
      building: b.building,
      bookingDate: b.bookingDate,
      checkIn: b.checkIn,
      status: mapBookingStatus(b.trang_thai),
    }));

    // Trả dữ liệu cho Dashboard
    return {
      totalBuildings: total_buildings,
      availableRooms: available_rooms,
      totalRooms: total_rooms,
      occupancyRate,
      pendingBookings: pending_bookings,
      maintenanceReports,
      roomStatus: {
        available: available_rooms,
        occupied: occupied_rooms,
        maintenance: maintenance_rooms,
        issues: issues_count,
      },
      recentBookings,
    };
  } finally {
    conn.release();
  }
}
