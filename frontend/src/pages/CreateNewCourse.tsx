import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../auth/authService';
import { PageHeader } from '../components/layout/PageHeader';
import { BackLink } from '../components/layout/BackLink';
import { Card } from '../components/ui/Card';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { Textarea } from '../components/ui/Textarea';
import { Select } from '../components/ui/Select';
import { Button } from '../components/ui/Button';

export const CreateNewCourse: React.FC = () => {
  const navigate = useNavigate();
  const currentUser = authService.getCurrentUser();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    status: 'draft',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCancel = () => {
    navigate('/courses');
  };

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

          <form>
            <FormField label="Course Title" required>
              <Input
                name="title"
                placeholder="Enter course title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Description" required>
              <Textarea
                name="description"
                placeholder="Describe what learners will gain from this course"
                value={formData.description}
                onChange={handleChange}
                rows={4}
              />
            </FormField>

            <FormField
              label="Video URL"
              required
              helperText="Use YouTube embed URL, iframe format for best compatibility"
            >
              <Input
                name="videoUrl"
                placeholder="https://www.youtube.com/embed/..."
                value={formData.videoUrl}
                onChange={handleChange}
              />
            </FormField>

            <FormField
              label="Thumbnail URL"
              required
              helperText="Recommended size: 1280×720 pixels"
            >
              <Input
                name="thumbnailUrl"
                placeholder="https://example.com/thumbnail.jpg"
                value={formData.thumbnailUrl}
                onChange={handleChange}
              />
            </FormField>

            <FormField label="Status" required>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </Select>
            </FormField>

            <div className="mb-6">
              <p className="text-sm text-orange-600">
                Only administrators can publish courses. Managers can save as draft.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="secondary" onClick={handleCancel} type="button">
                Cancel
              </Button>
              <Button variant="primary" disabled type="button">
                Save as Draft
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};
