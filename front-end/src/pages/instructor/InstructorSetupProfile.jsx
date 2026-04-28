import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/api';

const STEPS = ['Welcome', 'About You', 'Links'];

const InstructorSetupProfile = () => {
  const navigate = useNavigate();
  const [step, setStep]                     = useState(0);
  const [saving, setSaving]                 = useState(false);
  const [loading, setLoading]               = useState(true);
  const [done, setDone]                     = useState(false);
  const [avatarPreview, setAvatarPreview]   = useState(null);
  const [error, setError]                   = useState('');
  const [isEdit, setIsEdit]                 = useState(false);
  const [form, setForm] = useState({
    headline:     '',
    bio:          '',
    expertise:    '',
    website:      '',
    linkedin_url: '',
    avatar:       null,
  });

  const user     = JSON.parse(localStorage.getItem('user') || '{}');
  const initials = user.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'IN';

  // Fetch existing profile on mount
  useEffect(() => {
    apiService.instructor.getProfile()
      .then(res => {
        const profile = res.data?.profile;
        if (profile) {
          setForm({
            headline:     profile.headline     || '',
            bio:            profile.bio          || '',
            expertise:      profile.expertise    || '',
            website:        profile.website      || '',
            linkedin_url:   profile.linkedin_url || '',
            avatar:         null,
          });
          if (profile.avatar_url) {
            setAvatarPreview(profile.avatar_url);
          }
          setIsEdit(true);
          setStep(1); // skip welcome for existing profiles
        }
      })
      .catch(() => {
        // ignore errors — treat as empty profile
      })
      .finally(() => setLoading(false));
  }, []);

  const setField = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setField('avatar', file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setError('');
    setSaving(true);
    try {
      const fd = new FormData();
      // Always send text fields (including empty strings) so they can be cleared
      ['headline', 'bio', 'expertise', 'website', 'linkedin_url'].forEach(key => {
        fd.append(key, form[key] ?? '');
      });
      // Only send avatar if a new file was selected
      if (form.avatar instanceof File) {
        fd.append('avatar', form.avatar);
      }
      await apiService.instructor.updateProfile(fd);
      setDone(true);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = 'w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#592b98] focus:border-transparent text-sm';
  const labelCls = 'block text-sm font-medium text-gray-700 mb-2';

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#592b98] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (done) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="w-full max-w-md text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Profile saved!</h1>
            <p className="text-gray-600 text-sm mb-8">
              {isEdit
                ? 'Your instructor profile has been updated successfully.'
                : 'Your instructor profile is ready. Start creating your first course and share your knowledge with the world.'}
            </p>
            <button
              onClick={() => navigate('/instructor/dashboard')}
              className="w-full bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98]">
              Instructor Onboarding
            </p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              {step === 0 && `Welcome, ${user.name?.split(' ')[0] || 'Instructor'}!`}
              {step === 1 && (isEdit ? 'Update your profile' : 'Tell students about yourself')}
              {step === 2 && 'Add your links'}
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              {step === 0 && "Let's set up your instructor profile. Students will see this on your courses."}
              {step === 1 && 'Help students trust you with a great bio and photo.'}
              {step === 2 && 'Optionally share your website and LinkedIn profile.'}
            </p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((label, i) => (
              <React.Fragment key={label}>
                <div className={`flex-1 h-1 rounded-full transition-all ${
                  i <= step ? 'bg-[#592b98]' : 'bg-gray-200'
                }`} />
              </React.Fragment>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Card */}
          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">

            {/* ── Step 0: Welcome ── */}
            {step === 0 && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#592b98] to-[#9b6cd9] rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {initials}
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We'll guide you through setting up your profile in just a couple of steps.
                  You can always update it later from your dashboard.
                </p>
                <button
                  onClick={() => setStep(1)}
                  className="w-full bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => navigate('/instructor/dashboard')}
                  className="w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip for now
                </button>
              </div>
            )}

            {/* ── Step 1: About ── */}
            {step === 1 && (
              <div className="space-y-5">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-2">
                  <div className="relative flex-shrink-0">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="avatar" className="w-14 h-14 rounded-full object-cover border border-gray-200" />
                    ) : (
                      <div className="w-14 h-14 bg-gradient-to-br from-[#592b98] to-[#9b6cd9] rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {initials}
                      </div>
                    )}
                    <label className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#592b98] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#3e1f6b] transition-colors">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                      </svg>
                      <input type="file" accept="image/*" onChange={handleAvatar} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-400">Click + to upload a photo</p>
                  </div>
                </div>

                <div>
                  <label className={labelCls}>Professional Headline</label>
                  <input
                    type="text"
                    value={form.headline}
                    onChange={e => setField('headline', e.target.value)}
                    placeholder="e.g. Full Stack Developer & Web Instructor"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Areas of Expertise</label>
                  <input
                    type="text"
                    value={form.expertise}
                    onChange={e => setField('expertise', e.target.value)}
                    placeholder="e.g. JavaScript, React, Node.js"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>Bio</label>
                  <textarea
                    rows={4}
                    value={form.bio}
                    onChange={e => setField('bio', e.target.value)}
                    placeholder="Tell students about your background and teaching style..."
                    className={inputCls + ' resize-none'}
                  />
                </div>
              </div>
            )}

            {/* ── Step 2: Links ── */}
            {step === 2 && (
              <div className="space-y-5">
                <div>
                  <label className={labelCls}>Website / Portfolio</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={e => setField('website', e.target.value)}
                    placeholder="https://yourwebsite.com"
                    className={inputCls}
                  />
                </div>

                <div>
                  <label className={labelCls}>LinkedIn Profile</label>
                  <input
                    type="url"
                    value={form.linkedin_url}
                    onChange={e => setField('linkedin_url', e.target.value)}
                    placeholder="https://linkedin.com/in/yourname"
                    className={inputCls}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons — shown for steps 1 & 2 */}
          {step >= 1 && (
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setStep(s => s - 1)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 transition-colors text-sm"
              >
                ← Back
              </button>

              {step < 2 ? (
                <button
                  onClick={() => setStep(s => s + 1)}
                  className="flex-1 bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors text-sm"
                >
                  Continue
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 bg-[#592b98] text-white font-semibold py-3 rounded-md hover:bg-[#3e1f6b] transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (isEdit ? 'Update Profile' : 'Save Profile')}
                </button>
              )}
            </div>
          )}

          {/* Footer note */}
          <div className="mt-6 text-center text-xs text-gray-500">
            <p>You can update your profile anytime from your dashboard settings.</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InstructorSetupProfile;
