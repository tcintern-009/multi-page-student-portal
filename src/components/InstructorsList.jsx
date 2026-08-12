"use client";

import { useState, useEffect, useCallback } from "react";
import InstructorCard from "@/components/InstructorCard";
import SectionTitle from "@/components/SectionTitle";
import EmptyState from "@/components/EmptyState";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchInstructors } from "@/lib/api";

export default function InstructorsList() {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadInstructors = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchInstructors();
      setInstructors(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInstructors();
  }, [loadInstructors]);

  if (loading) {
    return <LoadingSpinner label="Loading instructors..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16 px-4">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Failed to load instructors
        </h3>
        <p className="text-gray-600 max-w-md mx-auto mb-6">{error}</p>
        <button
          onClick={loadInstructors}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Meet Our Instructors"
          subtitle="Learn from passionate educators with years of industry experience."
        />
        {instructors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No instructors available"
            message="Our instructor team is being updated. Please check back soon."
          />
        )}
      </div>
    </section>
  );
}
