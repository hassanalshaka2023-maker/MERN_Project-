import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Course = {
  _id: string;
  name: string;
  description?: string;
  price: number;
  maxStudents?: number;
  professorId: string;
  day: string;
  startDate?: string;
};

type Enrollment = {
  _id: string;
  student_id: string;
  course_id: string;
  attendance_status: string;
  result: string;
  grade?: number;
};

type Student = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

function ProfessorDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  const [enrollmentId, setEnrollmentId] = useState("");
  const [grade, setGrade] = useState("");
  const [gradeNote, setGradeNote] = useState("");

  const [attendanceEnrollmentId, setAttendanceEnrollmentId] = useState("");
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState("present");

  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");
  const professorId = localStorage.getItem("userId");

  useEffect(() => {
    getProfessorCourses();
    getEnrollments();
    getStudents();
  }, []);

  const getProfessorCourses = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/courses/professor?professorId=${professorId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load courses");
        return;
      }

      if (data.success) {
        setCourses(data.data);
      } else {
        setCourses(data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const getEnrollments = async () => {
    try {
      const response = await fetch("http://localhost:3000/enrollments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) return;

      setEnrollments(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) return;

      setStudents(data);
    } catch (error) {
      console.log(error);
    }
  };

  const getStudentName = (studentId: string) => {
    const student = students.find((item) => item._id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getStudentNameByEnrollmentId = (enrollmentId: string) => {
    const enrollment = enrollments.find((item) => item._id === enrollmentId);
    return enrollment ? getStudentName(enrollment.student_id) : "";
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find((item) => item._id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const getAverageGrade = () => {
    const grades = enrollments
      .map((item) => item.grade)
      .filter((grade): grade is number => typeof grade === "number");

    if (grades.length === 0) return 0;

    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return Math.round(total / grades.length);
  };

  const getSuccessRate = () => {
    if (enrollments.length === 0) return 0;

    const passed = enrollments.filter(
      (item) => item.result === "Passed",
    ).length;

    return Math.round((passed / enrollments.length) * 100);
  };

  const handleAddGrade = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/enrollments/grades/${enrollmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            grade: Number(grade),
            grade_note: gradeNote,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save grade");
        return;
      }

      setMessage("Grade saved successfully");

      setEnrollmentId("");
      setGrade("");
      setGradeNote("");

      getEnrollments();
      console.log(data);
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const handleAttendance = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3000/enrollments/attendance/${attendanceEnrollmentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attendance_date: attendanceDate,
            attendance_status: attendanceStatus,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to save attendance");
        return;
      }

      setMessage("Attendance saved successfully");

      setAttendanceEnrollmentId("");
      setAttendanceDate("");
      setAttendanceStatus("present");

      getEnrollments();
      console.log(data);
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1f1b1b] via-[#2a1f3d] to-[#111827] text-white flex">
      <aside className="w-64 min-h-screen bg-gradient-to-b from-[#6d5dfc] to-[#8b4bd8] p-8">
        <div className="mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#60a5fa] via-[#a855f7] to-[#ec4899] flex items-center justify-center shadow-lg mb-4">
            <span className="text-2xl font-bold">I</span>
          </div>

          <h2 className="text-2xl font-bold">IDEA</h2>
          <p className="text-sm text-purple-100">Training Center</p>
        </div>

        <ul className="space-y-5 text-lg font-medium">
          <li className="bg-white/15 rounded-xl px-4 py-3">Dashboard</li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            My Courses
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Students
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Attendance
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Grades
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Professor Dashboard</h1>
            <p className="text-gray-300 mt-2">
              Welcome to the course management panel
            </p>
          </div>

          <button
            onClick={logout}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#6c63ff] text-white font-semibold hover:scale-105 transition"
          >
            Logout
          </button>
        </header>

        {message && (
          <p className="mb-6 rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-pink-200">
            {message}
          </p>
        )}

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Total Courses</h3>
            <p className="text-3xl font-bold text-cyan-300">{courses.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Total Students</h3>
            <p className="text-3xl font-bold text-purple-300">
              {enrollments.length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Average Grade</h3>
            <p className="text-3xl font-bold text-pink-300">
              {getAverageGrade()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Success Rate</h3>
            <p className="text-3xl font-bold text-green-300">
              {getSuccessRate()}%
            </p>
          </motion.div>
        </section>

        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">My Courses</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Day</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">Price</th>
                </tr>
              </thead>

              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td className="p-4">No Courses Available</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="border-b border-white/10">
                      <td className="p-4">{course.name}</td>
                      <td className="p-4">{course.day}</td>
                      <td className="p-4">{course.startDate || "-"}</td>
                      <td className="p-4">{course.price}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">Enrolled Students</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4">Student Name</th>
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Result</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td className="p-4">No Data</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                  </tr>
                ) : (
                  enrollments.map((item) => (
                    <tr key={item._id} className="border-b border-white/10">
                      <td className="p-4">{getStudentName(item.student_id)}</td>
                      <td className="p-4">{getCourseName(item.course_id)}</td>
                      <td className="p-4">{item.grade ?? "-"}</td>
                      <td className="p-4">{item.attendance_status}</td>
                      <td className="p-4">{item.result}</td>
                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => setEnrollmentId(item._id)}
                          className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#ec4899] to-[#a855f7] text-white text-sm font-semibold hover:scale-105 transition"
                        >
                          Grade
                        </button>

                        <button
                          type="button"
                          onClick={() => setAttendanceEnrollmentId(item._id)}
                          className="ml-2 px-4 py-2 rounded-lg bg-gradient-to-r from-[#60a5fa] to-[#6c63ff] text-white text-sm font-semibold hover:scale-105 transition"
                        >
                          Attendance
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Add Student Grade</h2>

            <form className="space-y-4" onSubmit={handleAddGrade}>
              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Student Name"
                value={getStudentNameByEnrollmentId(enrollmentId)}
                readOnly
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="number"
                placeholder="Grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
              />

              <textarea
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none min-h-28"
                placeholder="Grade Note"
                value={gradeNote}
                onChange={(e) => setGradeNote(e.target.value)}
              ></textarea>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#6c63ff] font-semibold hover:scale-[1.02] transition"
              >
                Save Grade
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Add Student Attendance</h2>

            <form className="space-y-4" onSubmit={handleAttendance}>
              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Student Name"
                value={getStudentNameByEnrollmentId(attendanceEnrollmentId)}
                readOnly
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
              >
                <option value="present">Present</option>
                <option value="absent">Absent</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#60a5fa] to-[#a855f7] font-semibold hover:scale-[1.02] transition"
              >
                Save Attendance
              </button>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
}

export default ProfessorDashboard;
