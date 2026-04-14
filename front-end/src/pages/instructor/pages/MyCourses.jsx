import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import { useNavigate } from 'react-router-dom';

const MyCourses = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');

  const courses = [
    {
      id: 1,
      title: 'React Masterclass 2024: Build Modern Web Apps',
      description: 'Master React from basics to advanced concepts including hooks, context, Redux, and Next.js',
      thumbnail: 'https://images.unsplash.com/photo-1633374601450-f8c0a1f55847?w=400&h=225&fit=crop',
      students: 1245,
      price: 49.99,
      rating: 4.8,
      reviews: 342,
      status: 'Published',
      statusColor: 'green',
      lastUpdated: '2 days ago'
    },
    {
      id: 2,
      title: 'Node.js Backend Development: Zero to Hero',
      description: 'Build scalable REST APIs with Node.js, Express, MongoDB, and PostgreSQL',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
      students: 892,
      price: 44.99,
      rating: 4.7,
      reviews: 218,
      status: 'Published',
      statusColor: 'green',
      lastUpdated: '1 week ago'
    },
    {
      id: 3,
      title: 'TypeScript Basics: Type-Safe JavaScript',
      description: 'Learn TypeScript fundamentals and build type-safe applications',
      thumbnail: 'https://images.unsplash.com/photo-1516116246648-6fca1d56fc37?w=400&h=225&fit=crop',
      students: 0,
      price: 39.99,
      rating: 0,
      reviews: 0,
      status: 'Pending Review',
      statusColor: 'yellow',
      lastUpdated: '3 days ago'
    },
    {
      id: 4,
      title: 'Advanced CSS & Tailwind: Beautiful UIs',
      description: 'Create stunning user interfaces with modern CSS and Tailwind CSS framework',
      thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=225&fit=crop',
      students: 567,
      price: 34.99,
      rating: 4.9,
      reviews: 156,
      status: 'Published',
      statusColor: 'green',
      lastUpdated: '2 weeks ago'
    },
    {
      id: 5,
      title: 'Python for Data Science: Complete Bootcamp',
      description: 'Learn Python programming, data analysis, visualization, and machine learning',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=225&fit=crop',
      students: 234,
      price: 54.99,
      rating: 4.6,
      reviews: 89,
      status: 'Draft',
      statusColor: 'gray',
      lastUpdated: '5 days ago'
    },
    {
      id: 6,
      title: 'Docker & Kubernetes: Container Orchestration',
      description: 'Master containerization and orchestration for modern DevOps',
      thumbnail: 'https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=225&fit=crop',
      students: 445,
      price: 59.99,
      rating: 4.8,
      reviews: 134,
      status: 'Published',
      statusColor: 'green',
      lastUpdated: '1 month ago'
    }
  ];

  const filteredCourses = filter === 'all' ? courses : courses.filter(c => c.status.toLowerCase() === filter);

  return (
    <div>
      <Topbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
            <p className="text-gray-600 text-sm mt-1">Manage and edit your courses</p>
          </div>
          <button
            onClick={() => navigate('/instructor/create-course')}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#592b98] text-white rounded-md font-medium text-sm hover:bg-[#3e1f6b] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Course
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6">
          {['all', 'published', 'pending review', 'draft'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-[#592b98] text-white'
                  : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCourses.map((course) => (
            <Card key={course.id} padding="p-0" className="overflow-hidden hover:shadow-md transition-shadow">
              {/* Thumbnail */}
              <div className="relative h-40 bg-gray-200">
                <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
                <span className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-xs font-medium ${
                  course.statusColor === 'green'
                    ? 'bg-green-500 text-white'
                    : course.statusColor === 'yellow'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {course.status}
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-2">{course.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-2 mb-3">{course.description}</p>

                {/* Stats */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      {course.students.toLocaleString()}
                    </span>
                    {course.reviews > 0 && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-1" />
                        </svg>
                        {course.reviews}
                      </span>
                    )}
                  </div>
                  {course.rating > 0 && (
                    <div className="flex items-center gap-1">
                      <svg className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-medium text-gray-700">{course.rating}</span>
                    </div>
                  )}
                </div>

                {/* Price and Actions */}
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-gray-900">${course.price}</span>
                  <button
                    onClick={() => navigate(`/instructor/edit-course/${course.id}`)}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm text-[#592b98] font-medium hover:bg-purple-50 rounded-md transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3">Updated {course.lastUpdated}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyCourses;
