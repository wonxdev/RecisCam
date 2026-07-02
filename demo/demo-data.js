/**
 * demo-data.js
 * Sample data used to seed the RecisCam portfolio demo.
 * No real student data — everything here is fictional.
 */

const DEMO_SEED = {
  profiles: [
    {
      id: "teacher-01",
      email: "guru@demo.com",
      role: "teacher",
      full_name: "Bu Yuli",
      class: null,
      piket_day: null
    },
    {
      id: "student-01",
      email: "siswa@demo.com",
      role: "student",
      full_name: "Sonny Erwin Soebiantoro",
      class: "XII A",
      piket_day: "Senin"
    },
    {
      id: "student-02",
      email: "aulia@demo.com",
      role: "student",
      full_name: "Nathan Suwiji",
      class: "XII B",
      piket_day: "Selasa"
    },
    {
      id: "student-03",
      email: "bayu@demo.com",
      role: "student",
      full_name: "Nathaniel Edrick Ferdianto",
      class: "XII A",
      piket_day: "Rabu"
    }
  ],

  // created_at values are generated at seed time (relative to "today")
  // so the demo always looks current. See demo-store.js:buildSeedAttendance().
  attendance: [
    { userId: "student-01", daysAgo: 7, status: "present", note: "" },
    { userId: "student-01", daysAgo: 0, status: "pending", note: "" },
    { userId: "student-02", daysAgo: 6, status: "present", note: "" },
    { userId: "student-02", daysAgo: 13, status: "absent", note: "Tidak ada bukti foto" },
    { userId: "student-03", daysAgo: 8, status: "present", note: "" }
  ],

  notifications: [
    {
      userId: "student-02",
      message: "Laporan piket ditolak: Tidak ada bukti foto"
    }
  ]
};
