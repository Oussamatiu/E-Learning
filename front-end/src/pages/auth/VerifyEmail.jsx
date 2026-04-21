import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98]">Verify your email</p>
            <h1 className="mt-4 text-3xl font-bold text-gray-900">Almost there!</h1>
            <p className="mt-3 text-sm text-gray-600">
              We sent a confirmation email to {email ? <span className="font-semibold text-gray-900">{email}</span> : 'your inbox'}.
              Please open the message and follow the link to verify your account.
            </p>
          </div>

         

          <div className="mt-6 text-center text-sm text-gray-500">
            If you don't see the email, check your spam folder or request a new link from the login page.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
