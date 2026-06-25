import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Enrollment = {
  _id: string;
  course_id: string;
  attendance_status: string;
  attendance_date?: string;
  grade?: number;
  grade_note?: string;
  result: string;
  status: string;
};

type Course = {
  _id: string;
  name: string;
};

type AvailableCourse = {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxStudents: number;
  professorId: string;
  day: string;
  startDate: string;
  professor?: {
    name: string;
  };
};

function StudentDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [availableCourses, setAvailableCourses] = useState<AvailableCourse[]>([]);
  const [message, setMessage] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [showAllCourses, setShowAllCourses] = useState(false);
  const [requestedCourseIds, setRequestedCourseIds] = useState<string[]>([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    getMyEnrollments();
    getCourses();
    getAvailableCourses();
  }, []);

  const getMyEnrollments = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/enrollments/students/my-enrollments",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load student records");
        return;
      }

      setEnrollments(data);
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const getCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  const getAvailableCourses = async () => {
    try {
      const response = await fetch("http://localhost:3000/courses", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load courses");
        return;
      }

      if (data.success) {
        setAvailableCourses(data.data);
      } else {
        setAvailableCourses(data);
      }
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const getAverageGrade = () => {
    const grades = enrollments
      .map((item) => item.grade)
      .filter((grade): grade is number => typeof grade === "number");

    if (grades.length === 0) return 0;

    const total = grades.reduce((sum, grade) => sum + grade, 0);
    return Math.round(total / grades.length);
  };

  const getPassedCount = () => {
    return enrollments.filter((item) => item.result === "Passed").length;
  };

  const getCourseName = (courseId: string) => {
    const course = courses.find((item) => item._id === courseId);
    return course ? course.name : "Unknown Course";
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some((e) => e.course_id === courseId && e.status === "approved");
  };

  const hasPendingRequest = (courseId: string) => {
    return enrollments.some(
      (e) => e.course_id === courseId && e.status === "pending"
    );
  };

  const hasRejectedRequest = (courseId: string) => {
    return enrollments.some(
      (e) => e.course_id === courseId && e.status === "rejected"
    );
  };

  const handleRegister = async (courseId: string) => {
    setRequestedCourseIds((prev) => [...prev, courseId]);

    // ✅ 1. التحقق: هل الطالب مسجل بالفعل (approved)؟
    const isAlreadyEnrolled = enrollments.some(
      (e) => e.course_id === courseId && e.status === "approved"
    );

    if (isAlreadyEnrolled) {
      setRequestMessage("✅ You are already enrolled in this course.");
      setTimeout(() => setRequestMessage(""), 4000);
      return;
    }

    // ✅ 2. التحقق: هل يوجد طلب pending أو rejected لهذا الكورس؟
    const existingRequest = enrollments.some(
      (e) => e.course_id === courseId && (e.status === "pending" || e.status === "rejected"));

    if (existingRequest) {
      setRequestMessage("⚠️ You already have a request for this course (Pending or Rejected).");
      setTimeout(() => setRequestMessage(""), 4000);
      return;
    }

    // ✅ 3. إرسال الطلب
    try {
      const response = await fetch("http://localhost:3000/enrollments/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          studentId: userId,
          courseId: courseId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setRequestMessage(data.message || "Failed to register for course");
        setRequestedCourseIds((prev) => prev.filter((id) => id !== courseId));
        return;
      }

      setRequestMessage("✅ Registration request sent successfully! Waiting for manager approval.");
      
      getMyEnrollments();
      getAvailableCourses();
      
      setTimeout(() => setRequestMessage(""), 5000);
    } catch (error) {
      console.log(error);
      setRequestMessage("Server connection error");
      setRequestedCourseIds((prev) => prev.filter((id) => id !== courseId));
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b1120] via-[#241c4a] to-[#111827] text-white flex">
      <aside className="w-64 min-h-screen bg-gradient-to-b from-[#4f46e5] via-[#6d28d9] to-[#9333ea] p-8 shadow-2xl shadow-violet-950/50">
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
            My Grades
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            My Attendance
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Results
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Student Dashboard</h1>
            <p className="text-gray-300 mt-2">Welcome to your academic panel</p>
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
            <h3 className="text-gray-300">My Courses</h3>
            <p className="text-3xl font-bold text-cyan-300">
              {enrollments.filter(e => e.status === 'approved').length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Average Grade</h3>
            <p className="text-3xl font-bold text-purple-300">
              {getAverageGrade()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Passed Courses</h3>
            <p className="text-3xl font-bold text-pink-300">
              {getPassedCount()}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Result</h3>
            <p className="text-3xl font-bold text-green-300">
              {getPassedCount() > 0 ? "Passed" : "Pending"}
            </p>
          </motion.div>
        </section>

        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
          <h2 className="text-2xl font-bold mb-5">My Academic Records</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Attendance</th>
                  <th className="p-4">Grade</th>
                  <th className="p-4">Grade Note</th>
                  <th className="p-4">Result</th>
                </tr>
              </thead>

              <tbody>
                {enrollments.length === 0 ? (
                  <tr>
                    <td className="p-4">No Data Available</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                  </tr>
                ) : (
                  enrollments.map((item) => (
                    <tr key={item._id} className="border-b border-white/10">
                      <td className="p-4">{getCourseName(item.course_id)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          item.status === 'approved' 
                            ? 'bg-green-500/30 text-green-300' 
                            : item.status === 'rejected'
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-yellow-500/30 text-yellow-300'
                        }`}>
                          {item.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4">{item.attendance_status || "-"}</td>
                      <td className="p-4">{item.grade ?? "-"}</td>
                      <td className="p-4">{item.grade_note || "-"}</td>
                      <td className="p-4">{item.result}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* ===== ALL AVAILABLE COURSES ===== */}
        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mt-8">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-2xl font-bold">📚 All Available Courses</h2>
            
            <button
              onClick={() => setShowAllCourses(!showAllCourses)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#60a5fa] to-[#a855f7] text-sm font-semibold hover:scale-105 transition"
            >
              {showAllCourses ? "Hide Courses" : "View All Courses"}
            </button>
          </div>

          {requestMessage && (
            <p className={`mb-4 rounded-xl px-4 py-3 ${
              requestMessage.includes('successfully') 
                ? 'bg-green-500/20 border border-green-500/50 text-green-200'
                : 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-200'
            }`}>
              {requestMessage}
            </p>
          )}

          {showAllCourses && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-4">Course Name</th>
                    <th className="p-4">Description</th>
                    <th className="p-4">Day</th>
                    <th className="p-4">Start Date</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Max Students</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {availableCourses.length === 0 ? (
                    <tr>
                      <td className="p-4" colSpan={7}>
                        No courses available at the moment
                      </td>
                    </tr>
                  ) : (
                    availableCourses.map((course) => {
                      const enrolled = isEnrolled(course._id);
                      const pending = hasPendingRequest(course._id);
                      const rejected = hasRejectedRequest(course._id);
                      const requested = requestedCourseIds.includes(course._id);

                      return (
                        <tr key={course._id} className="border-b border-white/10">
                          <td className="p-4 font-semibold">{course.name}</td>
                          <td className="p-4 text-sm text-gray-300">
                            {course.description || "-"}
                          </td>
                          <td className="p-4">{course.day}</td>
                          <td className="p-4">{course.startDate}</td>
                          <td className="p-4">${course.price}</td>
                          <td className="p-4">{course.maxStudents}</td>
                          <td className="p-4 text-center">
                            {enrolled ? (
                              <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-300 text-sm">
                                ✅ Enrolled
                              </span>
                            ) : pending ? (
                              <span className="px-3 py-1 rounded-full bg-yellow-500/30 text-yellow-300 text-sm">
                                ⏳ Pending Approval
                              </span>
                            ) : rejected ? (
                              <span className="px-3 py-1 rounded-full bg-red-500/30 text-red-300 text-sm">
                                ❌ Rejected
                              </span>
                            ) : requested ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-semibold cursor-not-allowed opacity-80"
                            >
                              Registered
                            </button>
                          ) : (
                            <button
                              onClick={() => handleRegister(course._id)}
                              className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-lime-500 text-slate-900 text-sm font-semibold hover:scale-105 transition duration-300"
                            >
                              Register
                            </button>
                          )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default StudentDashboard;