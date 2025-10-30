import React from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../auth/authService';
import { getCourseDetail } from '../mocks/courseDetail';
import { PageHeader } from '../components/layout/PageHeader';
import { BackLink } from '../components/layout/BackLink';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

export const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = authService.getCurrentUser();
  const course = id ? getCourseDetail(id) : null;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Course not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackLink to="/courses">Back to Courses</BackLink>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="aspect-video bg-gray-900">
                <iframe
                  src={course.videoUrl}
                  title={course.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            <Card>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              <div className="mb-6">
                <ProgressBar progress={course.progress || 0} />
              </div>

              <Button variant="primary" className="mb-6">
                Play
              </Button>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-3">
                  About This Course
                </h2>
                <p className="text-gray-600 leading-relaxed">{course.description}</p>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Course Information
              </h3>
              <div className="space-y-3">
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Duration: <strong className="text-gray-900">{course.duration}</strong></span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">Created by: <strong className="text-gray-900">{course.createdBy}</strong></span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Status: <strong className="text-green-600">{course.status}</strong></span>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Your Progress
              </h3>
              <div className="space-y-3">
                {course.milestones.map((milestone) => (
                  <div key={milestone.percentage} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        milestone.completed ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {milestone.completed && (
                          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {milestone.percentage}% Complete
                      </span>
                    </div>
                    {milestone.completedAt && (
                      <span className="text-xs text-gray-500">{milestone.completedAt}</span>
                    )}
                  </div>
                ))}
                {course.lastActivity && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Last activity: {course.lastActivity}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
