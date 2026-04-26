import { verifyEmail } from "../../services/authService";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";

export default function CheckEmail() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!token) { setStatus("error"); return; }

    const checkToken = async () => {
      try {
        const data = await verifyEmail(token);
        const roleId = data?.role_id;
        setStatus("success");

        setTimeout(() => {
          if (roleId === 2) {
            navigate("/login?setup=profile");
          } else {
            navigate("/login");
          }
        }, 2500);
      } catch (error) {
        console.error("FULL ERROR:", error);
        setStatus(error.message || "error");
      }
    };
    checkToken();
  }, [token]);
console.log("TOKEN:", token);
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#592b98] border-t-transparent"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verifying your email...</h2>
            <p className="text-sm text-gray-600">Please wait while we confirm your account.</p>
          </div>
        );

      case "success":
        return (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Email verified successfully!</h2>
            <p className="text-sm text-gray-600 mb-4">Your account is now active. Redirecting you to login...</p>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-[#592b98] h-2 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        );

      case "error":
        return (
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Verification failed</h2>
            <p className="text-sm text-gray-600 mb-6">The verification link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full rounded-md bg-[#592b98] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3e1f6b]"
            >
              Go to login
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#592b98]">Email verification</p>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Confirm your account</h1>
          </div>

          <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
            {renderContent()}
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Need help? Contact our support team.
          </div>
        </div>
      </div>
    </div>
  );
}