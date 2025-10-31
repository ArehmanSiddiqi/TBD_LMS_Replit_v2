import React, { useState, useEffect } from 'react';
import { authService } from '../auth/authService';
import { usersService, type User } from '../services/users';
import { assignmentsService, type Assignment } from '../services/assignments';
import { PageHeader } from '../components/layout/PageHeader';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { AssignCoursesToUserModal } from '../components/modals/AssignCoursesToUserModal';

interface TeamMemberWithStats extends User {
  assignedCount: number;
  inProgressCount: number;
  completedCount: number;
  assignedCourseIds: number[];
}

export const MyTeamPage: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [searchQuery, setSearchQuery] = useState('');
  const [addSearchQuery, setAddSearchQuery] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMemberWithStats[]>([]);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState('');
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberWithStats | null>(null);
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    loadTeamData();
  }, []);

  const loadTeamData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [teamUsers, assignments] = await Promise.all([
        usersService.getTeamMembers(),
        assignmentsService.getTeamAssignments(),
      ]);
      
      const membersWithStats = teamUsers.map(employee => {
        const userAssignments = assignments.filter(a => a.user === employee.id);
        return {
          ...employee,
          assignedCount: userAssignments.length,
          inProgressCount: userAssignments.filter(a => a.status === 'in_progress').length,
          completedCount: userAssignments.filter(a => a.status === 'completed').length,
          assignedCourseIds: userAssignments.map(a => a.course.id),
        };
      });

      setTeamMembers(membersWithStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!addSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      const results = await usersService.search(addSearchQuery);
      const teamMemberIds = new Set(teamMembers.map(m => m.id));
      setSearchResults(results.filter(u => !teamMemberIds.has(u.id) && u.role === 'EMPLOYEE'));
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setSearching(false);
    }
  };

  const handleAddTeamMember = async (userId: number) => {
    try {
      await usersService.addTeamMember({ user_id: userId });
      alert('Team member added successfully!');
      setAddSearchQuery('');
      setSearchResults([]);
      setShowAddMember(false);
      loadTeamData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to add team member');
    }
  };

  const handleAssignClick = (member: TeamMemberWithStats) => {
    setSelectedMember(member);
    setAssignModalOpen(true);
  };

  const filteredMembers = teamMembers.filter((member) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = `${member.first_name} ${member.last_name}`.toLowerCase();
    return (
      name.includes(query) ||
      member.job_title.toLowerCase().includes(query) ||
      member.email.toLowerCase().includes(query)
    );
  });

  const getMemberName = (member: User) => {
    return `${member.first_name} ${member.last_name}`.trim() || member.email;
  };

  const getInitials = (member: User) => {
    const name = getMemberName(member);
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader currentUser={currentUser} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Team</h1>
            <p className="text-gray-600 mt-1">Manage your team members and their courses</p>
          </div>
          <Button onClick={() => setShowAddMember(!showAddMember)}>
            {showAddMember ? 'Cancel' : 'Add Team Member'}
          </Button>
        </div>

        {showAddMember && (
          <Card className="mb-6 p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search for Employee</h3>
            <div className="flex gap-3 mb-4">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={addSearchQuery}
                onChange={(e) => setAddSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1"
              />
              <Button onClick={handleSearch} disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 bg-white border border-gray-300 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                        {getInitials(user)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getMemberName(user)}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>
                    </div>
                    <Button
                      variant="secondary"
                      onClick={() => handleAddTeamMember(user.id)}
                    >
                      Add to Team
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}

        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading team...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600">{error}</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map((member) => (
                <Card key={member.id} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                      {getInitials(member)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-lg">{getMemberName(member)}</h3>
                      <p className="text-sm text-gray-600">{member.job_title || member.email}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4 flex-wrap">
                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                      {member.assignedCount} assigned
                    </span>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      {member.completedCount} completed
                    </span>
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => handleAssignClick(member)}
                      className="w-full text-sm"
                    >
                      Assign Courses
                    </Button>
                  </div>
                </Card>
              ))}
            </div>

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No team members found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>

      {selectedMember && (
        <AssignCoursesToUserModal
          isOpen={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            loadTeamData();
          }}
          userId={selectedMember.id}
          userName={getMemberName(selectedMember)}
          existingCourseIds={selectedMember.assignedCourseIds}
        />
      )}
    </div>
  );
};
