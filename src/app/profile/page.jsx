"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchMyProfile, updateMyProfile } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function ProfileForm() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMyProfile();
      setProfile(data);
      setFormData({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setActionError(null);
    setSuccessMsg(null);
    try {
      const updated = await updateMyProfile({
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || undefined,
      });
      setProfile(updated);
      setEditing(false);
      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading profile..." />;

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load profile
        </h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={load}
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {successMsg && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {successMsg}
        </div>
      )}
      {actionError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Profile Information
          </h3>
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {editing ? (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Name *
              </label>
              <input
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email *
              </label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone
              </label>
              <input
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditing(false);
                  setActionError(null);
                  setFormData({
                    name: profile.name,
                    email: profile.email,
                    phone: profile.phone || "",
                  });
                }}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Name</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.name}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Email</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.email}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Phone</span>
              <span className="text-sm font-medium text-gray-900">
                {profile.phone || "—"}
              </span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <span className="text-sm text-gray-500">Role</span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                {user?.role}
              </span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-gray-500">Member since</span>
              <span className="text-sm font-medium text-gray-900">
                {new Date(profile.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        )}
      </div>

      {profile.enrollments && profile.enrollments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Enrolled Courses ({profile.enrollments.length})
          </h3>
          <div className="space-y-3">
            {profile.enrollments.map((e) => (
              <div
                key={e.id}
                className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
              >
                <a
                  href={`/courses/${e.courseSlug}`}
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {e.courseTitle}
                </a>
                <span
                  className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    e.status === "active"
                      ? "bg-green-100 text-green-800"
                      : e.status === "completed"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <section className="bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">My Profile</h1>
          <p className="text-blue-100 text-lg mt-2">
            View and manage your account information.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <ProfileForm />
        </div>
      </section>
    </ProtectedRoute>
  );
}
