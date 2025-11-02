import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { authService } from '../auth/authService';
import { coursesService, type Course } from '../services/courses';
import { assignmentsService, type Assignment } from '../services/assignments';
import { PageHeader } from '../components/layout/PageHeader';
import { BackLink } from '../components/layout/BackLink';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProgressBar } from '../components/ui/ProgressBar';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const CourseView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const currentUser = authService.getCurrentUser();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [isStarting, setIsStarting] = useState(false);
  
  const playerRef = useRef<any>(null);
  // In browser environment setInterval returns a number
  const progressIntervalRef = useRef<number | null>(null);
  const lastReportedProgressRef = useRef(0);

  const getYouTubeVideoId = (url: string): string | null => {
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }
    return null;
  };

  const updateProgress = useCallback(async (newProgress: number) => {
    if (!assignment) return;

    const progressChange = Math.abs(newProgress - lastReportedProgressRef.current);
    
    if (progressChange >= 5 || newProgress === 100) {
      try {
        const status = newProgress === 100 ? 'completed' : 
                      newProgress > 0 ? 'in_progress' : 'not_started';
        
        const updated = await assignmentsService.updateProgress(assignment.id, {
          progress_pct: newProgress,
          status,
        });
        
        setAssignment(updated);
        setProgress(newProgress);
        lastReportedProgressRef.current = newProgress;
      } catch (err) {
        console.error('Failed to update progress:', err);
      }
    }
  }, [assignment]);

  const trackProgress = useCallback(() => {
    if (!playerRef.current) return;

    try {
      const currentTime = playerRef.current.getCurrentTime();
      const duration = playerRef.current.getDuration();
      
      if (duration > 0) {
        const currentProgress = Math.min(Math.round((currentTime / duration) * 100), 100);
        setProgress(currentProgress);
        updateProgress(currentProgress);
      }
    } catch (err) {
      console.error('Error tracking progress:', err);
    }
  }, [updateProgress]);

  const initYouTubePlayer = useCallback((videoId: string) => {
    if (!window.YT || !window.YT.Player) {
      setTimeout(() => initYouTubePlayer(videoId), 100);
      return;
    }

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId,
      playerVars: {
        autoplay: 0,
        modestbranding: 1,
        rel: 0,
      },
      events: {
        onReady: () => {
          progressIntervalRef.current = setInterval(trackProgress, 10000);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            if (!progressIntervalRef.current) {
              progressIntervalRef.current = setInterval(trackProgress, 10000);
            }
          } else if (event.data === window.YT.PlayerState.PAUSED || 
                     event.data === window.YT.PlayerState.ENDED) {
            trackProgress();
          }
        },
      },
    });
  }, [trackProgress]);

  const loadYouTubeAPI = useCallback(() => {
    if (window.YT && window.YT.Player) {
      return;
    }

    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
  }, []);

  useEffect(() => {
    if (id) {
      loadCourseAndAssignment(Number(id));
    }
    
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [id]);

  useEffect(() => {
    if (course?.video_url && assignment) {
      const videoId = getYouTubeVideoId(course.video_url);
      if (videoId) {
        loadYouTubeAPI();
        window.onYouTubeIframeAPIReady = () => initYouTubePlayer(videoId);
        if (window.YT && window.YT.Player) {
          initYouTubePlayer(videoId);
        }
      }
    }
  }, [course, assignment, loadYouTubeAPI, initYouTubePlayer]);

  const loadCourseAndAssignment = async (courseId: number) => {
    try {
      setLoading(true);
      setError('');
      
      const courseData = await coursesService.getById(courseId);
      setCourse(courseData);

      try {
        const assignments = await assignmentsService.getMyAssignments();
        const courseAssignment = assignments.find(a => a.course.id === courseId);
        
        if (courseAssignment) {
          setAssignment(courseAssignment);
          setProgress(courseAssignment.progress_pct);
          lastReportedProgressRef.current = courseAssignment.progress_pct;
        }
      } catch (err) {
        console.log('No assignment found yet');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load course');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = async () => {
    if (!course || !currentUser || isStarting) return;

    try {
      setIsStarting(true);
      
      const newAssignment = await assignmentsService.createAssignment({
        course_id: course.id,
      });
      
      setAssignment(newAssignment);
      setProgress(0);
      lastReportedProgressRef.current = 0;
      
    } catch (err) {
      console.error('Error starting course:', err);
      setError('Failed to start course. Please try again.');
    } finally {
      setIsStarting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PageHeader currentUser={currentUser} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-red-600">{error || 'Course not found'}</p>
        </div>
      </div>
    );
  }

  const videoId = getYouTubeVideoId(course.video_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackLink to="/courses">Back to Courses</BackLink>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {course.video_url && videoId && assignment && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-900">
                  <div id="youtube-player" className="w-full h-full"></div>
                </div>
              </div>
            )}

            {course.video_url && !videoId && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-video bg-gray-900">
                  <iframe
                    src={course.video_url}
                    title={course.title}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            <Card>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
              
              {assignment && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Your Progress</span>
                    <span className="text-sm font-bold text-gray-900">{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} />
                  {assignment.status === 'completed' && (
                    <p className="text-green-600 text-sm font-medium mt-2">✓ Course Completed!</p>
                  )}
                </div>
              )}

              {!assignment && currentUser?.role === 'EMPLOYEE' && (
                <Button 
                  variant="primary" 
                  className="mb-6"
                  onClick={handleStartCourse}
                  disabled={isStarting}
                >
                  {isStarting ? 'Starting...' : 'Start Course'}
                </Button>
              )}

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
                  <span className="text-gray-600">Duration: <strong className="text-gray-900">{course.duration || 'Self-paced'}</strong></span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="text-gray-600">Created by: <strong className="text-gray-900">{course.created_by_name}</strong></span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-gray-600">Level: <strong className="text-green-600 capitalize">{course.level}</strong></span>
                </div>
                <div className="flex items-center text-sm">
                  <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-gray-600">Updated: <strong className="text-gray-900">{new Date(course.updated_at).toLocaleDateString()}</strong></span>
                </div>
              </div>
            </Card>

            {assignment && (
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Progress
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      assignment.status === 'completed' ? 'text-green-600' :
                      assignment.status === 'in_progress' ? 'text-blue-600' :
                      'text-gray-600'
                    }`}>
                      {assignment.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Assigned by:</span>
                    <span className="font-semibold text-gray-900">{assignment.assigned_by_name}</span>
                  </div>
                  {assignment.last_activity_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last activity:</span>
                      <span className="font-semibold text-gray-900">
                        {new Date(assignment.last_activity_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
