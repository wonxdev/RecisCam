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
      full_name: "Bu Sarah",
      class: null,
      piket_day: null
    },
    {
      id: "student-01",
      email: "siswa@demo.com",
      role: "student",
      full_name: "Dimas Pratama",
      class: "XII A",
      piket_day: "Senin"
    },
    {
      id: "student-02",
      email: "aulia@demo.com",
      role: "student",
      full_name: "Aulia Rahman",
      class: "XII B",
      piket_day: "Selasa"
    },
    {
      id: "student-03",
      email: "bayu@demo.com",
      role: "student",
      full_name: "Bayu Saputra",
      class: "XII A",
      piket_day: "Rabu"
    }
  ],

  // Each record lands on the student's actual piket weekday, `weeksAgo`
  // weeks before the most recent one, so the demo looks current and
  // consistent no matter which day it is opened.
  // See demo-store.js:buildSeedAttendance().
  attendance: [
    { userId: "student-01", weeksAgo: 0, status: "pending", note: "" },
    { userId: "student-01", weeksAgo: 1, status: "present", note: "" },
    { userId: "student-01", weeksAgo: 2, status: "present", note: "" },
    { userId: "student-01", weeksAgo: 3, status: "present", note: "" },
    { userId: "student-02", weeksAgo: 0, status: "present", note: "" },
    { userId: "student-02", weeksAgo: 1, status: "absent", note: "Tidak ada bukti foto" },
    { userId: "student-03", weeksAgo: 0, status: "present", note: "" }
  ],

  notifications: [
    {
      userId: "student-02",
      message: "Laporan piket ditolak: Tidak ada bukti foto"
    }
  ]
};
