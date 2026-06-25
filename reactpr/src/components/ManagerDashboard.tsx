import { useEffect, useState } from "react";
import { motion } from "framer-motion";

type Student = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type Professor = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type Course = {
  _id: string;
  name: string;
  description: string;
  price: number;
  maxStudents: number;
  professorId: string;
  day: string;
  startDate: string;
};

type InstituteAnalytics = {
  totalEnrollments: number;
  instituteSuccessRate: string;
};

type Enrollment = {
  _id: string;
  student_id: string | { _id: string; name: string; email: string };
  course_id: string | { _id: string; name: string };
  status: string;
  attendance_status: string;
  result: string;
  enrollment_date: string;
};

function ManagerDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [professors, setProfessors] = useState<Professor[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [analytics, setAnalytics] = useState<InstituteAnalytics | null>(null);
  const [allEnrollments, setAllEnrollments] = useState<Enrollment[]>([]);
  const [message, setMessage] = useState("");

  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userRole, setUserRole] = useState("Student");

  const [courseName, setCourseName] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [coursePrice, setCoursePrice] = useState("");
  const [maxStudents, setMaxStudents] = useState("");
  const [professorId, setProfessorId] = useState("");
  const [manualProfessorId, setManualProfessorId] = useState("");
  const [courseDay, setCourseDay] = useState("");
  const [startDate, setStartDate] = useState("");

  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Edit User states
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
  const [editUserName, setEditUserName] = useState("");
  const [editUserEmail, setEditUserEmail] = useState("");
  const [editUserRole, setEditUserRole] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    getStudents();
    getProfessors();
    getCourses();
    getInstituteAnalytics();
    getEnrollments();
  }, []);

  const getStudents = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load students");
        return;
      }

      setStudents(data);
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const getProfessors = async () => {
    try {
      const response = await fetch("http://localhost:3000/users/professors", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load professors");
        return;
      }

      setProfessors(data);
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

  const getInstituteAnalytics = async () => {
    try {
      const response = await fetch(
        "http://localhost:3000/enrollments/analytics/institute",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to load analytics");
        return;
      }

      setAnalytics(data);
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

      if (!response.ok) {
        setMessage(data.message || "Failed to load enrollments");
        return;
      }

      setAllEnrollments(data);
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const updateEnrollmentStatus = async (enrollmentId: string, status: string) => {
    try {
      const response = await fetch(
        `http://localhost:3000/enrollments/${enrollmentId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update status");
        return;
      }

      setMessage(`✅ Enrollment ${status === 'approved' ? 'approved' : 'rejected'} successfully!`);
      getEnrollments();
      getInstituteAnalytics();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3000/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: userName,
          email: userEmail,
          password: userPassword,
          role: userRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create user");
        return;
      }

      setMessage("User created successfully");

      setUserName("");
      setUserEmail("");
      setUserPassword("");
      setUserRole("Student");

      getStudents();
      getProfessors();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const createCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    const selectedProfessorId = manualProfessorId || professorId;

    if (!selectedProfessorId) {
      setMessage("Please select a professor or enter professor ID manually");
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: courseName,
          description: courseDescription,
          price: Number(coursePrice),
          maxStudents: Number(maxStudents),
          professorId: selectedProfessorId,
          day: courseDay,
          startDate: startDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to create course");
        return;
      }

      setMessage("Course created successfully");

      setCourseName("");
      setCourseDescription("");
      setCoursePrice("");
      setMaxStudents("");
      setProfessorId("");
      setManualProfessorId("");
      setCourseDay("");
      setStartDate("");

      getCourses();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const handleDelete = async (courseId: string) => {
    if (!window.confirm("Are you sure you want to delete this course?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete course");
        return;
      }

      setMessage("Course deleted successfully");
      getCourses();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setCourseName(course.name);
    setCourseDescription(course.description || "");
    setCoursePrice(course.price.toString());
    setMaxStudents(course.maxStudents.toString());
    setProfessorId(course.professorId);
    setManualProfessorId(course.professorId);
    setCourseDay(course.day);
    setStartDate(course.startDate);
    setIsEditModalOpen(true);
  };

  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingCourse) return;

    const selectedProfessorId = manualProfessorId || professorId;

    try {
      const response = await fetch(
        `http://localhost:3000/courses/${editingCourse._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: courseName,
            description: courseDescription,
            price: Number(coursePrice),
            maxStudents: Number(maxStudents),
            professorId: selectedProfessorId,
            day: courseDay,
            startDate: startDate,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update course");
        return;
      }

      setMessage("Course updated successfully");
      setIsEditModalOpen(false);
      setEditingCourse(null);

      setCourseName("");
      setCourseDescription("");
      setCoursePrice("");
      setMaxStudents("");
      setProfessorId("");
      setManualProfessorId("");
      setCourseDay("");
      setStartDate("");

      getCourses();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  // ====== DELETE STUDENT ======
  const handleDeleteStudent = async (studentId: string) => {
    if (!window.confirm("Are you sure you want to delete this student?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${studentId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete student");
        return;
      }

      setMessage("✅ Student deleted successfully");
      getStudents();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  // ====== DELETE PROFESSOR ======
  const handleDeleteProfessor = async (professorId: string) => {
    if (!window.confirm("Are you sure you want to delete this professor?")) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/users/${professorId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to delete professor");
        return;
      }

      setMessage("✅ Professor deleted successfully");
      getProfessors();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  // ====== EDIT USER ======
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserRole(user.role);
    setIsEditUserModalOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingUser) return;

    try {
      const response = await fetch(`http://localhost:3000/users/${editingUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Failed to update user");
        return;
      }

      setMessage("✅ User updated successfully");
      setIsEditUserModalOpen(false);
      setEditingUser(null);
      
      getStudents();
      getProfessors();
    } catch (error) {
      console.log(error);
      setMessage("Server connection error");
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const getProfessorName = (professorId: string) => {
    const professor = professors.find((p) => p._id === professorId);
    return professor ? professor.name : "Unknown";
  };

  const getStudentName = (studentId: string | { _id: string; name: string; email: string }) => {
    if (typeof studentId === 'object' && studentId !== null) {
      return studentId.name || "Unknown";
    }
    const student = students.find((s) => s._id === studentId);
    return student ? student.name : "Unknown Student";
  };

  const getStudentEmail = (studentId: string | { _id: string; name: string; email: string }) => {
    if (typeof studentId === 'object' && studentId !== null) {
      return studentId.email || "-";
    }
    const student = students.find((s) => s._id === studentId);
    return student ? student.email : "-";
  };

  const getCourseNameFromEnrollment = (courseId: string | { _id: string; name: string }) => {
    if (typeof courseId === 'object' && courseId !== null) {
      return courseId.name || "Unknown Course";
    }
    const course = courses.find((c) => c._id === courseId);
    return course ? course.name : "Unknown Course";
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
            Courses
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Professors
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Students
          </li>
          <li className="hover:bg-white/15 rounded-xl px-4 py-3 transition">
            Reports
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-8 overflow-x-hidden">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Manager Dashboard</h1>
            <p className="text-gray-300 mt-2">
              Welcome to the institute management panel
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

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Students</h3>
            <p className="text-3xl font-bold text-cyan-300">
              {students.length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Professors</h3>
            <p className="text-3xl font-bold text-purple-300">
              {professors.length}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Courses</h3>
            <p className="text-3xl font-bold text-pink-300">{courses.length}</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Enrollments</h3>
            <p className="text-3xl font-bold text-orange-300">
              {analytics?.totalEnrollments ?? 0}
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h3 className="text-gray-300">Success Rate</h3>
            <p className="text-3xl font-bold text-green-300">
              {analytics?.instituteSuccessRate ?? "0%"}
            </p>
          </motion.div>
        </section>

        {/* ===== ENROLLMENTS MANAGEMENT ===== */}
        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">
            📋 Pending Enrollment Requests
            {allEnrollments.filter(e => e.status === 'pending').length > 0 && (
              <span className="ml-2 text-sm bg-yellow-500/30 px-3 py-1 rounded-full">
                {allEnrollments.filter(e => e.status === 'pending').length} pending
              </span>
            )}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4">Student</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Course</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Enrollment Date</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {allEnrollments.length === 0 ? (
                  <tr>
                    <td className="p-4" colSpan={6}>
                      No enrollments found
                    </td>
                  </tr>
                ) : (
                  allEnrollments.map((enrollment) => (
                    <tr key={enrollment._id} className="border-b border-white/10">
                      <td className="p-4 font-semibold">
                        {getStudentName(enrollment.student_id)}
                      </td>
                      <td className="p-4">{getStudentEmail(enrollment.student_id)}</td>
                      <td className="p-4">{getCourseNameFromEnrollment(enrollment.course_id)}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          enrollment.status === 'approved' 
                            ? 'bg-green-500/30 text-green-300' 
                            : enrollment.status === 'rejected'
                            ? 'bg-red-500/30 text-red-300'
                            : 'bg-yellow-500/30 text-yellow-300'
                        }`}>
                          {enrollment.status || 'pending'}
                        </span>
                      </td>
                      <td className="p-4">
                        {new Date(enrollment.enrollment_date).toLocaleDateString()}
                      </td>
                      <td className="p-4 text-center">
                        {enrollment.status === 'pending' ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => updateEnrollmentStatus(enrollment._id, 'approved')}
                              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-semibold transition"
                            >
                              ✅ Approve
                            </button>
                            <button
                              onClick={() => updateEnrollmentStatus(enrollment._id, 'rejected')}
                              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition"
                            >
                              ❌ Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">Processed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Create User</h2>

            <form className="space-y-4" onSubmit={createUser}>
              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Full Name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="email"
                placeholder="Email Address"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="password"
                placeholder="Password"
                value={userPassword}
                onChange={(e) => setUserPassword(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                value={userRole}
                onChange={(e) => setUserRole(e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Professor">Professor</option>
              </select>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ec4899] to-[#6c63ff] font-semibold hover:scale-[1.02] transition"
              >
                Create User
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Create Course</h2>

            <form className="space-y-4" onSubmit={createCourse}>
              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Course Name"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Description"
                value={courseDescription}
                onChange={(e) => setCourseDescription(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="number"
                placeholder="Price"
                value={coursePrice}
                onChange={(e) => setCoursePrice(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="number"
                placeholder="Max Students"
                value={maxStudents}
                onChange={(e) => setMaxStudents(e.target.value)}
              />

              <select
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                value={professorId}
                onChange={(e) => setProfessorId(e.target.value)}
              >
                <option value="">Select Professor</option>
                {professors.map((professor) => (
                  <option key={professor._id} value={professor._id}>
                    {professor.name}
                  </option>
                ))}
              </select>

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="text"
                placeholder="Day"
                value={courseDay}
                onChange={(e) => setCourseDay(e.target.value)}
              />

              <input
                className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#60a5fa] to-[#a855f7] font-semibold hover:scale-[1.02] transition"
              >
                Create Course
              </button>
            </form>
          </section>
        </div>

        <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6 mb-8">
          <h2 className="text-2xl font-bold mb-5">Courses List</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-white/10">
                  <th className="p-4">Course Name</th>
                  <th className="p-4">Professor</th>
                  <th className="p-4">Day</th>
                  <th className="p-4">Start Date</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Max Students</th>
                  <th className="p-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody>
                {courses.length === 0 ? (
                  <tr>
                    <td className="p-4">No Courses Available</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                    <td className="p-4">-</td>
                  </tr>
                ) : (
                  courses.map((course) => (
                    <tr key={course._id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                      <td className="p-4">{course.name}</td>
                      <td className="p-4">
                        {getProfessorName(course.professorId)}
                      </td>
                      <td className="p-4">{course.day}</td>
                      <td className="p-4">{course.startDate}</td>
                      <td className="p-4">{course.price}</td>
                      <td className="p-4">{course.maxStudents}</td>
                      
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleEdit(course)}
                            className="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(course._id)}
                            className="px-3 py-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* ===== PROFESSORS LIST ===== */}
          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Professors List</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-4">Professor Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {professors.length === 0 ? (
                    <tr>
                      <td className="p-4">No Professors Available</td>
                      <td className="p-4">-</td>
                      <td className="p-4">-</td>
                      <td className="p-4">-</td>
                    </tr>
                  ) : (
                    professors.map((professor) => (
                      <tr key={professor._id} className="border-b border-white/10">
                        <td className="p-4">{professor.name}</td>
                        <td className="p-4">{professor.email}</td>
                        <td className="p-4">{professor.role}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditUser(professor)}
                              className="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteProfessor(professor._id)}
                              className="px-3 py-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* ===== STUDENTS LIST ===== */}
          <section className="rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-5">Students List</h2>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-white/10">
                    <th className="p-4">Student Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Role</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {students.length === 0 ? (
                    <tr>
                      <td className="p-4">No Students Available</td>
                      <td className="p-4">-</td>
                      <td className="p-4">-</td>
                      <td className="p-4">-</td>
                    </tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student._id} className="border-b border-white/10">
                        <td className="p-4">{student.name}</td>
                        <td className="p-4">{student.email}</td>
                        <td className="p-4">{student.role}</td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleEditUser(student)}
                              className="px-3 py-1 text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteStudent(student._id)}
                              className="px-3 py-1 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* ===== EDIT COURSE MODAL ===== */}
        {isEditModalOpen && editingCourse && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#2a1f3d] rounded-3xl p-8 max-w-lg w-full border border-white/20 max-h-[90vh] overflow-y-auto"
            >
              <h2 className="text-2xl font-bold mb-5">Edit Course</h2>

              <form onSubmit={handleUpdateCourse} className="space-y-4">
                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="text"
                  placeholder="Course Name"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  required
                />

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="text"
                  placeholder="Description"
                  value={courseDescription}
                  onChange={(e) => setCourseDescription(e.target.value)}
                />

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="number"
                  placeholder="Price"
                  value={coursePrice}
                  onChange={(e) => setCoursePrice(e.target.value)}
                  required
                />

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="number"
                  placeholder="Max Students"
                  value={maxStudents}
                  onChange={(e) => setMaxStudents(e.target.value)}
                  required
                />

                <select
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  value={professorId}
                  onChange={(e) => setProfessorId(e.target.value)}
                >
                  <option value="">Select Professor</option>
                  {professors.map((prof) => (
                    <option key={prof._id} value={prof._id}>
                      {prof.name}
                    </option>
                  ))}
                </select>

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="text"
                  placeholder="Day (e.g., Monday)"
                  value={courseDay}
                  onChange={(e) => setCourseDay(e.target.value)}
                  required
                />

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#60a5fa] to-[#a855f7] font-semibold hover:scale-[1.02] transition"
                  >
                    Update Course
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditModalOpen(false);
                      setEditingCourse(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ===== EDIT USER MODAL ===== */}
        {isEditUserModalOpen && editingUser && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#2a1f3d] rounded-3xl p-8 max-w-lg w-full border border-white/20"
            >
              <h2 className="text-2xl font-bold mb-5">Edit User</h2>

              <form onSubmit={handleUpdateUser} className="space-y-4">
                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="text"
                  placeholder="Full Name"
                  value={editUserName}
                  onChange={(e) => setEditUserName(e.target.value)}
                  required
                />

                <input
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  type="email"
                  placeholder="Email Address"
                  value={editUserEmail}
                  onChange={(e) => setEditUserEmail(e.target.value)}
                  required
                />

                <select
                  className="w-full rounded-xl bg-white/90 text-gray-900 px-4 py-3 outline-none"
                  value={editUserRole}
                  onChange={(e) => setEditUserRole(e.target.value)}
                >
                  <option value="Student">Student</option>
                  <option value="Professor">Professor</option>
                  <option value="Manager">Manager</option>
                </select>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#60a5fa] to-[#a855f7] font-semibold hover:scale-[1.02] transition"
                  >
                    Update User
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsEditUserModalOpen(false);
                      setEditingUser(null);
                    }}
                    className="flex-1 py-3 rounded-xl bg-white/20 hover:bg-white/30 transition font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ManagerDashboard;