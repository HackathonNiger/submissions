import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Calendar,
  Trophy,
  TrendingUp,
  MessageSquare,
  Settings,
  Bell,
  Menu,
  X,
  Star,
  CheckCircle,
  Clock,
  Download,
  Play,
  BarChart3,
  Users,
  Award,
  Target,
  Brain
} from 'lucide-react';

interface CourseProgress {
  id: string;
  title: string;
  progress: number;
  lastAccessed: string;
  completedLessons: number;
  totalLessons: number;
  nextLesson: string;
}

interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'course' | 'assignment' | 'system';
}

// Rename prop interface to avoid name collision with component
interface StudentDashboardProps {
  user?: { name: string; email: string };
}

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user }) => {
  // Safe fallback user to prevent crashes / blank screen
  const safeUser = user ?? { name: 'Guest User', email: 'guest@example.com' };

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock data
  const courses: CourseProgress[] = [
    {
      id: 'waec-maths',
      title: 'WAEC Mathematics Mastery',
      progress: 75,
      lastAccessed: '2 hours ago',
      completedLessons: 30,
      totalLessons: 40,
      nextLesson: 'Trigonometry Applications'
    },
    {
      id: 'jamb-physics',
      title: 'JAMB Physics Crash Course',
      progress: 45,
      lastAccessed: '1 day ago',
      completedLessons: 18,
      totalLessons: 40,
      nextLesson: 'Wave Optics'
    },
    {
      id: 'neco-english',
      title: 'NECO English Language Excellence',
      progress: 90,
      lastAccessed: '30 minutes ago',
      completedLessons: 36,
      totalLessons: 40,
      nextLesson: 'Final Mock Exam'
    }
  ];

  const assignments: Assignment[] = [
    {
      id: 'assign-1',
      title: 'Mathematics Practice Test 3',
      course: 'WAEC Mathematics Mastery',
      dueDate: '2024-12-15',
      status: 'pending'
    },
    {
      id: 'assign-2',
      title: 'Physics Weekly Quiz',
      course: 'JAMB Physics Crash Course',
      dueDate: '2024-12-10',
      status: 'submitted',
      score: 85
    },
    {
      id: 'assign-3',
      title: 'English Essay Grading',
      course: 'NECO English Language Excellence',
      dueDate: '2024-12-05',
      status: 'graded',
      score: 92
    }
  ];

  const performanceData = {
    overallProgress: 70,
    weeklyStudyTime: 12.5,
    avgScore: 87,
    streak: 7
  };

  // Load notifications
  useEffect(() => {
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'New Lesson Available',
        message: 'Trigonometry Applications is now ready in your WAEC Maths course',
        time: '2 hours ago',
        read: false,
        type: 'course'
      },
      {
        id: '2',
        title: 'Assignment Due Soon',
        message: 'Your Physics Weekly Quiz is due in 2 days',
        time: '1 day ago',
        read: false,
        type: 'assignment'
      },
      {
        id: '3',
        title: 'System Update',
        message: 'New Igbo language content added to all courses',
        time: '3 days ago',
        read: true,
        type: 'system'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const StatCard = ({ title, value, icon: Icon, trend }: {
    title: string;
    value: string | number;
    icon: any;
    trend?: 'up' | 'down'
  }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${
          trend === 'up' ? 'bg-green-100' :
          trend === 'down' ? 'bg-red-100' : 'bg-blue-100'
        }`}>
          <Icon className={`w-6 h-6 ${
            trend === 'up' ? 'text-green-600' :
            trend === 'down' ? 'text-red-600' : 'text-blue-600'
          }`} />
        </div>
      </div>
    </div>
  );

  const ProgressCard = ({ course }: { course: CourseProgress }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-semibold text-gray-900">{course.title}</h3>
          <p className="text-sm text-gray-600 mt-1">Last accessed: {course.lastAccessed}</p>
        </div>
        <div className="flex items-center bg-yellow-100 px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="ml-1 text-sm font-medium text-gray-800">4.8</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium text-gray-900">{course.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-green-500 to-teal-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <span className="text-gray-600">Lessons completed</span>
          <p className="font-medium text-gray-900">{course.completedLessons}/{course.totalLessons}</p>
        </div>
        <div>
          <span className="text-gray-600">Next lesson</span>
          <p className="font-medium text-gray-900 truncate">{course.nextLesson}</p>
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2 rounded-lg font-medium hover:from-green-700 hover:to-teal-700 transition-all flex items-center justify-center">
        <Play className="w-4 h-4 mr-2" />
        Continue Learning
      </button>
    </div>
  );

  const AssignmentCard = ({ assignment }: { assignment: Assignment }) => {
    const getStatusColor = () => {
      switch (assignment.status) {
        case 'graded': return 'bg-green-100 text-green-800';
        case 'submitted': return 'bg-yellow-100 text-yellow-800';
        case 'pending': return 'bg-red-100 text-red-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    const getStatusText = () => {
      switch (assignment.status) {
        case 'graded': return `Scored ${assignment.score}%`;
        case 'submitted': return 'Submitted';
        case 'pending': return 'Pending';
        default: return 'Unknown';
      }
    };

    return (
      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-medium text-gray-900">{assignment.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-2">{assignment.course}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">Due: {assignment.dueDate}</span>
          <button className="text-green-600 hover:text-green-700 font-medium text-sm">
            View Details
          </button>
        </div>
      </div>
    );
  };

  return (
  <div className="min-h-screen bg-gradient-to-br from-teal-50 to-gray-100 pt-24 md:pt-24 pb-16">
      {/* Mobile header */}
      <div className="md:hidden bg-white shadow-sm px-4 py-4 fixed top-0 w-full z-40">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 -ml-2 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <h1 className="ml-2 text-xl font-bold text-gray-900">SmartEd Africa</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowNotifications(true)}
              className="relative p-2 text-gray-600 hover:text-gray-900"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              )}
            </button>
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {safeUser.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className={`fixed md:static md:translate-x-0 transform transition-transform duration-300 ease-in-out z-50 md:z-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:w-64 w-full h-screen bg-white shadow-lg md:shadow-none`}>
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-teal-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <span className="ml-3 text-xl font-bold text-gray-900">SmartEd Africa</span>
            </div>
          </div>

          <nav className="p-4">
            <div className="space-y-1">
              {[
                { id: 'overview', label: 'Dashboard', icon: BarChart3 },
                { id: 'courses', label: 'My Courses', icon: BookOpen },
                { id: 'assignments', label: 'Assignments', icon: Target },
                { id: 'progress', label: 'Progress', icon: TrendingUp },
                { id: 'community', label: 'Study Groups', icon: Users },
                { id: 'ai-tutor', label: 'AI Tutor', icon: Brain },
                { id: 'achievements', label: 'Achievements', icon: Trophy },
                { id: 'messages', label: 'Messages', icon: MessageSquare },
                { id: 'settings', label: 'Settings', icon: Settings }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-green-50 to-teal-50 text-green-700 border-r-2 border-green-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                {safeUser.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-900">{safeUser.name}</p>
                <p className="text-sm text-gray-600">Student</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 md:ml-0 ml-0 md:mt-0 mt-16">
          <div className="p-4 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welcome back, {safeUser.name.split(' ')[0]}!</h1>
                <p className="text-gray-600 mt-1">Continue your learning journey</p>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-600 hover:text-gray-900 bg-white rounded-lg shadow-sm border border-gray-200"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
                  {safeUser.name.split(' ').map(n => n[0]).join('')}
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Overall Progress"
                value={`${performanceData.overallProgress}%`}
                icon={TrendingUp}
                trend="up"
              />
              <StatCard
                title="Weekly Study Time"
                value={`${performanceData.weeklyStudyTime}h`}
                icon={Clock}
                trend="up"
              />
              <StatCard
                title="Average Score"
                value={`${performanceData.avgScore}%`}
                icon={Award}
                trend="up"
              />
              <StatCard
                title="Current Streak"
                value={`${performanceData.streak} days`}
                icon={Trophy}
                trend="up"
              />
            </div>

            {/* Main Content Tabs */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Continue Learning */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Continue Learning</h2>
                    <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {courses.map(course => (
                      <ProgressCard key={course.id} course={course} />
                    ))}
                  </div>
                </div>

                {/* Recent Assignments */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Recent Assignments</h2>
                    <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {assignments.map(assignment => (
                      <AssignmentCard key={assignment.id} assignment={assignment} />
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Brain className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Ask AI Tutor</h3>
                    <p className="text-gray-600 text-sm">Get instant help with difficult topics</p>
                  </button>
                  <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                      <Download className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Download Lessons</h3>
                    <p className="text-gray-600 text-sm">Save courses for offline access</p>
                  </button>
                  <button className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-left">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Join Study Group</h3>
                    <p className="text-gray-600 text-sm">Collaborate with classmates</p>
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {courses.map(course => (
                    <ProgressCard key={course.id} course={course} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Assignments</h2>
                <div className="space-y-4">
                  {assignments.map(assignment => (
                    <AssignmentCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              </div>
            )}

            {/* Add other tabs as needed */}
          </div>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Notifications Modal */}
      {showNotifications && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
                <button type="button"
                  onClick={() => setShowNotifications(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="overflow-y-auto max-h-96">
              {notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map(notification => (
                    <div
                      key={notification.id}
                      className={`p-4 ${!notification.read ? 'bg-green-50' : ''}`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">{notification.title}</h3>
                          <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                        </div>
                        <span className="text-xs text-gray-500">{notification.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={() => setShowNotifications(false)}
                className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
