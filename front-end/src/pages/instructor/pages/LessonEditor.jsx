import React, { useState } from 'react';
import Topbar from '../components/Topbar';
import Card from '../components/Card';
import { useNavigate, useParams } from 'react-router-dom';

const LessonEditor = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [lessonData, setLessonData] = useState({
    title: 'Welcome to the Course',
    type: 'video',
    content: '',
    videoFile: null,
    videoPreview: null,
    duration: '2:30',
    isPreview: true,
    isFree: false,
    resources: []
  });

  const [activeTab, setActiveTab] = useState('content');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLessonData(prev => ({
        ...prev,
        videoFile: file,
        videoPreview: URL.createObjectURL(file)
      }));
    }
  };

  const tabs = [
    { id: 'content', label: 'Content' },
    { id: 'details', label: 'Lesson Details' },
    { id: 'resources', label: 'Resources' }
  ];

  return (
    <div>
      <Topbar />

      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => navigate('/instructor/course-structure')}
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Curriculum
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Edit Lesson</h1>
            <p className="text-gray-600 text-sm mt-1">Add and manage lesson content</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Preview
            </button>
            <button className="px-4 py-2 bg-[#592b98] text-white rounded-md text-sm font-medium hover:bg-[#3e1f6b] transition-colors">
              Save Lesson
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Lesson Title */}
            <Card>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Title</label>
                <input
                  type="text"
                  value={lessonData.title}
                  onChange={(e) => setLessonData({ ...lessonData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm"
                />
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-gray-200 mb-4">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-[#592b98] text-[#592b98]'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {activeTab === 'content' && (
                <div className="space-y-4">
                  {/* Content Type Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
                    <div className="grid grid-cols-3 gap-3">
                      {['video', 'article', 'quiz'].map((type) => (
                        <button
                          key={type}
                          onClick={() => setLessonData({ ...lessonData, type })}
                          className={`flex flex-col items-center gap-2 p-4 border-2 rounded-md transition-colors ${
                            lessonData.type === type
                              ? 'border-[#592b98] bg-purple-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <div className={`p-2 rounded-md ${
                            type === 'video' ? 'bg-blue-100 text-blue-600' :
                            type === 'article' ? 'bg-green-100 text-green-600' :
                            'bg-yellow-100 text-yellow-600'
                          }`}>
                            {type === 'video' && (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {type === 'article' && (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            {type === 'quiz' && (
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                          </div>
                          <span className="text-sm font-medium capitalize">{type}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Upload */}
                  {lessonData.type === 'video' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Upload Video</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-md p-8 text-center hover:border-[#592b98] transition-colors">
                        <input
                          type="file"
                          accept="video/*"
                          onChange={handleFileChange}
                          className="hidden"
                          id="video-upload"
                        />
                        <label htmlFor="video-upload" className="cursor-pointer">
                          {lessonData.videoPreview ? (
                            <div className="relative">
                              <video src={lessonData.videoPreview} controls className="mx-auto max-h-64 rounded-md" />
                              <button
                                onClick={(e) => {
                                  e.preventDefault();
                                  setLessonData(prev => ({ ...prev, videoFile: null, videoPreview: null }));
                                }}
                                className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              <p className="text-sm text-gray-600 mt-2">Click to upload or drag and drop</p>
                              <p className="text-xs text-gray-500 mt-1">MP4, WebM up to 2GB</p>
                              <p className="text-xs text-gray-500 mt-1">Recommended: 720p or 1080p</p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  )}

                  {/* Article Editor */}
                  {lessonData.type === 'article' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Article Content</label>
                      <div className="border border-gray-300 rounded-md overflow-hidden">
                        {/* Toolbar */}
                        <div className="flex items-center gap-1 px-3 py-2 bg-gray-50 border-b border-gray-300">
                          <button className="p-1.5 hover:bg-gray-200 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                          </button>
                          <div className="w-px h-6 bg-gray-300 mx-2"></div>
                          <button className="p-1.5 hover:bg-gray-200 rounded font-bold">B</button>
                          <button className="p-1.5 hover:bg-gray-200 rounded italic">I</button>
                          <button className="p-1.5 hover:bg-gray-200 rounded underline">U</button>
                          <div className="w-px h-6 bg-gray-300 mx-2"></div>
                          <button className="p-1.5 hover:bg-gray-200 rounded">
                            <span className="text-xs">H1</span>
                          </button>
                          <button className="p-1.5 hover:bg-gray-200 rounded">
                            <span className="text-xs">H2</span>
                          </button>
                          <div className="w-px h-6 bg-gray-300 mx-2"></div>
                          <button className="p-1.5 hover:bg-gray-200 rounded">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                            </svg>
                          </button>
                        </div>
                        <textarea
                          value={lessonData.content}
                          onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                          rows={12}
                          placeholder="Write your article content here..."
                          className="w-full px-4 py-3 focus:outline-none text-sm resize-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Quiz Builder */}
                  {lessonData.type === 'quiz' && (
                    <div className="text-center py-8">
                      <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h3 className="text-lg font-medium text-gray-900 mt-4">Quiz Builder</h3>
                      <p className="text-gray-600 text-sm mt-2">Create multiple choice questions to test student knowledge</p>
                      <button className="mt-4 px-4 py-2 bg-[#592b98] text-white rounded-md text-sm font-medium hover:bg-[#3e1f6b] transition-colors">
                        Create Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lesson Duration</label>
                    <input
                      type="text"
                      value={lessonData.duration}
                      onChange={(e) => setLessonData({ ...lessonData, duration: e.target.value })}
                      placeholder="e.g., 10:30 or 5 min read"
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Preview Available</p>
                      <p className="text-xs text-gray-500 mt-1">Allow students to preview this lesson for free</p>
                    </div>
                    <button
                      onClick={() => setLessonData({ ...lessonData, isPreview: !lessonData.isPreview })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        lessonData.isPreview ? 'bg-[#592b98]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          lessonData.isPreview ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-gray-200">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Free Lesson</p>
                      <p className="text-xs text-gray-500 mt-1">Make this lesson accessible without purchase</p>
                    </div>
                    <button
                      onClick={() => setLessonData({ ...lessonData, isFree: !lessonData.isFree })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        lessonData.isFree ? 'bg-[#592b98]' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          lessonData.isFree ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'resources' && (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center hover:border-[#592b98] transition-colors cursor-pointer">
                    <svg className="mx-auto h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600 mt-2">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">PDF, ZIP, DOCX up to 50MB</p>
                  </div>

                  {lessonData.resources.length > 0 && (
                    <div className="space-y-2">
                      {lessonData.resources.map((resource, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                          <div className="flex items-center gap-3">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{resource.name}</p>
                              <p className="text-xs text-gray-500">{resource.size}</p>
                            </div>
                          </div>
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-md">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Lesson Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Published</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last Updated</span>
                  <span className="text-sm font-medium text-gray-900">2 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Views</span>
                  <span className="text-sm font-medium text-gray-900">1,234</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium text-gray-900">87%</span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload New Video
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Regenerate Thumbnail
                </button>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 1.342a4 4 0 110-2.684m0 2.684l.662 1.324c.474.948 1.796.948 2.27 0l.662-1.324m0 1.324l.662 1.324c.474.948 1.796.948 2.27 0l.662-1.324m0-1.324l-.662-1.324c-.474-.948-1.796-.948-2.27 0l-.662 1.324m0-1.324L9.342 8m0 0a4 4 0 110-2.684m0 2.684L8.684 6.658" />
                  </svg>
                  Share Lesson
                </button>
                <div className="border-t border-gray-200 my-2"></div>
                <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Lesson
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonEditor;
