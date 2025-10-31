import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { coursesService } from '../services/courses';
import { PageHeader } from '../components/layout/PageHeader';
import { BackLink } from '../components/layout/BackLink';
import { Card } from '../components/ui/Card';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

// Normalize YouTube URL to embed format
function normalizeYouTubeUrl(url: string): string {
  if (!url) return url;
  
  // Already an embed URL
  if (url.includes('/embed/')) {
    return url;
  }
  
  // Extract video ID from various YouTube URL formats
  const watchMatch = url.match(/[?&]v=([^&]+)/);
  const shortMatch = url.match(/youtu\.be\/([^?]+)/);
  const videoId = watchMatch?.[1] || shortMatch?.[1];
  
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // Not a YouTube URL, return as-is
  return url;
}

// Validate image URL
function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  const urlPattern = /^https?:\/\/.+/i;
  const imageExtPattern = /\.(png|jpe?g|webp)(\?.*)?$/i;
  return urlPattern.test(url) && imageExtPattern.test(url);
}

export const CreateNewCourse: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role === 'ADMIN';
  const isManager = currentUser?.role === 'MANAGER' || currentUser?.role === 'TL' || currentUser?.role === 'SRMGR';
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    video_url: '',
    thumbnail_url: '',
    status: isAdmin ? 'draft' : 'awaiting_approval',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [thumbnailError, setThumbnailError] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }

    // Update thumbnail preview
    if (name === 'thumbnail_url') {
      if (isValidImageUrl(value)) {
        setThumbnailPreview(value);
        setThumbnailError(false);
      } else {
        setThumbnailPreview(null);
        setThumbnailError(value.length > 0);
      }
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Course title is required';
    } else if (formData.title.trim().length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.trim().length > 120) {
      errors.title = 'Title must not exceed 120 characters';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      errors.description = 'Description must be at least 10 characters';
    } else if (formData.description.trim().length > 2000) {
      errors.description = 'Description must not exceed 2000 characters';
    }

    if (!formData.video_url.trim()) {
      errors.video_url = 'Video URL is required';
    }

    if (!formData.thumbnail_url.trim()) {
      errors.thumbnail_url = 'Thumbnail URL is required';
    } else if (!isValidImageUrl(formData.thumbnail_url)) {
      errors.thumbnail_url = 'Must be a valid image URL (http/https ending in .png, .jpg, .jpeg, or .webp)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setError('Please fix the validation errors');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Normalize YouTube URL before submitting
      const normalizedVideoUrl = normalizeYouTubeUrl(formData.video_url);
      
      await coursesService.create({
        title: formData.title.trim(),
        description: formData.description.trim(),
        video_url: normalizedVideoUrl,
        thumbnail_url: formData.thumbnail_url.trim(),
        status: formData.status,
      });

      // Success! Navigate back to courses
      navigate('/courses', { 
        state: { 
          toast: isManager 
            ? 'Course created and submitted for approval' 
            : 'Course created successfully' 
        } 
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create course');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/courses');
  };

  const isFormValid = 
    formData.title.trim().length >= 3 && 
    formData.title.trim().length <= 120 &&
    formData.description.trim().length >= 10 && 
    formData.description.trim().length <= 2000 &&
    formData.video_url.trim() !== '' &&
    formData.thumbnail_url.trim() !== '' &&
    isValidImageUrl(formData.thumbnail_url);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackLink to="/courses">Back to Courses</BackLink>
        
        <Card>
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
            <p className="text-gray-600 mt-1">
              Fill in the details below to create a new learning course
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <FormField 
              label="Course Title" 
              required
              error={validationErrors.title}
            >
              <Input
                name="title"
                placeholder="Enter course title (3-120 characters)"
                value={formData.title}
                onChange={handleChange}
                maxLength={120}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/120 characters
              </p>
            </FormField>

            <FormField 
              label="Description" 
              required
              error={validationErrors.description}
            >
              <Textarea
                name="description"
                placeholder="Describe what learners will gain from this course (10-2000 characters)"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                maxLength={2000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/2000 characters
              </p>
            </FormField>

            <FormField
              label="Video URL"
              required
              helperText="YouTube URL (will be converted to embed format automatically)"
              error={validationErrors.video_url}
            >
              <Input
                name="video_url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={formData.video_url}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              label="Thumbnail URL"
              required
              helperText="Must be a valid image URL (.png, .jpg, .jpeg, or .webp)"
              error={validationErrors.thumbnail_url}
            >
              <Input
                name="thumbnail_url"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnail_url}
                onChange={handleChange}
              />
              
              {/* Thumbnail Preview */}
              {formData.thumbnail_url && (
                <div className="mt-3">
                  {thumbnailPreview && !thumbnailError ? (
                    <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                        onError={() => setThumbnailError(true)}
                      />
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded">
                        ✓ Valid
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="mt-2 text-sm">
                          {thumbnailError ? 'Invalid image URL' : 'Preview will appear here'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </FormField>

            <FormField label="Status" required>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={isManager}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
              {isManager && (
                <p className="text-sm text-orange-600 mt-2">
                  Draft / Awaiting admin review - Your course will be submitted for admin approval
                </p>
              )}
            </FormField>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={handleCancel} type="button" disabled={loading}>
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading || !isFormValid}
              >
                {loading ? 'Saving...' : 'Save as Draft'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
