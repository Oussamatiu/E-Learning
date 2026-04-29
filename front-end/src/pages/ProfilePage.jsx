import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); }
    catch (e) { return {}; }
  });

  const [name, setName] = useState(user.name || '');
  const [instructorForm, setInstructorForm] = useState({
    headline:     '',
    bio:          '',
    expertise:    '',
    website:      '',
    linkedin_url: '',
    avatar:       null,
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);

  const isInstructor = user.role_id === 2 || user.role?.title === 'instructor';
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, profileRes] = await Promise.all([
          apiService.user.getMe(),
          isInstructor ? apiService.instructor.getProfile() : Promise.resolve({ data: { profile: null } }),
        ]);

        const freshUser = userRes.data?.user;
        if (freshUser) {
          setUser(freshUser);
          setName(freshUser.name || '');
          localStorage.setItem('user', JSON.stringify(freshUser));
        }

        const profile = profileRes.data?.profile;
        if (profile) {
          setInstructorForm({
            headline:     profile.headline     || '',
            bio:          profile.bio          || '',
            expertise:    profile.expertise    || '',
            website:      profile.website      || '',
            linkedin_url: profile.linkedin_url || '',
            avatar:       null,
          });
          if (profile.avatar_url) setAvatarPreview(profile.avatar_url);
          setHasProfile(true);
        }
      } catch (e) {
        // ignore — use local state
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isInstructor]);

  const setField = (key, val) => setInstructorForm(f => ({ ...f, [key]: val }));

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField('avatar', file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const promises = [];

      // Update user name if changed
      if (name.trim() && name.trim() !== user.name) {
        promises.push(apiService.user.updateMe({ name: name.trim() }));
      }

      // Update instructor profile
      if (isInstructor) {
        const fd = new FormData();
        ['headline', 'bio', 'expertise', 'website', 'linkedin_url'].forEach(key => {
          fd.append(key, instructorForm[key] ?? '');
        });
        if (instructorForm.avatar instanceof File) {
          fd.append('avatar', instructorForm.avatar);
        }
        promises.push(apiService.instructor.updateProfile(fd));
      }

      const results = await Promise.all(promises);

      // Refresh user in localStorage if updated
      const userResult = results.find(r => r.data?.user);
      if (userResult) {
        localStorage.setItem('user', JSON.stringify(userResult.data.user));
        setUser(userResult.data.user);
      }

      setSuccess('Profile saved successfully!');
      setHasProfile(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-1.5';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#592b98] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-6">

        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
          <button
            onClick={() => navigate('/instructor/dashboard')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md text-sm text-red-600">{error}</div>
        )}
        {success && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md text-sm text-green-600">{success}</div>
        )}

        {/* Account Info */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-5">Account Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>Email</label>
              <input
                type="email"
                value={user.email || ''}
                disabled
                className={inputCls + ' bg-gray-100 text-gray-500 cursor-not-allowed'}
              />
            </div>
            <div>
              <label className={labelCls}>Role</label>
              <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                isInstructor ? 'bg-purple-100 text-[#592b98]' : 'bg-blue-50 text-blue-600'
              }`}>
                {isInstructor ? 'Instructor' : 'Student'}
              </span>
            </div>
          </div>
        </div>
                    {console.log('Avatar preview URL:', avatarPreview)}

        {/* Instructor Profile */}
        {isInstructor && (
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-5">Instructor Profile</h2>

            <div className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-[#592b98] to-[#9b6cd9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {initials}
                    </div>
                  )}
                  <label className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#592b98] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3e1f6b] transition-colors">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                    </svg>
                    <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                  </label>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Profile Photo</p>
                  <p className="text-xs text-gray-400">Click + to upload a new photo</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Professional Headline</label>
                  <input
                    type="text"
                    value={instructorForm.headline}
                    onChange={e => setField('headline', e.target.value)}
                    placeholder="e.g. Full Stack Developer & Web Instructor"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>Areas of Expertise</label>
                  <input
                    type="text"
                    value={instructorForm.expertise}
                    onChange={e => setField('expertise', e.target.value)}
                    placeholder="e.g. JavaScript, React, Node.js"
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className={labelCls}>Bio</label>
                <textarea
                  rows={4}
                  value={instructorForm.bio}
                  onChange={e => setField('bio', e.target.value)}
                  placeholder="Tell students about your background and teaching style..."
                  className={inputCls + ' resize-none'}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className={labelCls}>Website / Portfolio</label>
                  <input
                    type="url"
                    value={instructorForm.website}
                    onChange={e => setField('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label className={labelCls}>LinkedIn Profile</label>
                  <input
                    type="url"
                    value={instructorForm.linkedin_url}
                    onChange={e => setField('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#592b98] text-white font-semibold px-8 py-3 rounded-md hover:bg-[#3e1f6b] transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {saving && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {hasProfile ? 'Update Profile' : 'Save Profile'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
