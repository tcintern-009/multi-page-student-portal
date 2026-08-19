"use client";

import { useState, useEffect, useCallback } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import LoadingSpinner from "@/components/LoadingSpinner";
import EmptyState from "@/components/EmptyState";
import { fetchUsers, updateUserRole } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
  const [actionError, setActionError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = { page, limit: 10 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      const data = await fetchUsers(params);
      setUsers(data.users);
      setPagination(data.pagination || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search, roleFilter, page]);

  useEffect(() => {
    const timer = setTimeout(load, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [load, search]);

  const handleRoleChange = async (userId, newRole) => {
    setUpdatingId(userId);
    setActionError(null);
    try {
      await updateUserRole(userId, newRole);
      await load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && users.length === 0) {
    return <LoadingSpinner label="Loading users..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load users
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
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search by name or email..."
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {actionError && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {actionError}
        </div>
      )}

      {users.length > 0 ? (
        <>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {u.name}
                      {u.id === currentUser?.id && (
                        <span className="ml-2 text-xs text-gray-400">
                          (you)
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {u.email}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                          u.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      {u.id !== currentUser?.id && (
                        <button
                          onClick={() =>
                            handleRoleChange(
                              u.id,
                              u.role === "admin" ? "student" : "admin",
                            )
                          }
                          disabled={updatingId === u.id}
                          className={`text-sm font-medium px-3 py-1 rounded-lg border transition-colors disabled:opacity-50 ${
                            u.role === "admin"
                              ? "text-orange-600 border-orange-200 hover:bg-orange-50"
                              : "text-purple-600 border-purple-200 hover:bg-purple-50"
                          }`}
                        >
                          {updatingId === u.id
                            ? "Updating..."
                            : u.role === "admin"
                              ? "Demote to Student"
                              : "Promote to Admin"}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.page} of {pagination.totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(pagination.totalPages, p + 1))
                }
                disabled={page >= pagination.totalPages}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <EmptyState title="No users found" message="Try a different search." />
      )}
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <ProtectedRoute requireAdmin>
      <section className="bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">User Management</h1>
          <p className="text-purple-100 text-lg mt-2">
            Manage user accounts and assign roles.
          </p>
        </div>
      </section>
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <UserManagement />
        </div>
      </section>
    </ProtectedRoute>
  );
}
