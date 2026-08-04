import InstructorCard from "@/components/InstructorCard";
import SectionTitle from "@/components/SectionTitle";
import { instructors } from "@/data/instructors";

export const metadata = {
  title: "Instructors | Student Course Portal",
  description: "Meet our expert instructors at Student Course Portal",
};

export default function InstructorsPage() {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Our Expert Instructors
          </h1>
          <p className="text-purple-100 text-lg max-w-2xl">
            Learn from passionate educators with years of industry experience.
            Our instructors are dedicated to helping you succeed.
          </p>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="Meet Our Instructors"
            subtitle="Learn from passionate educators with years of industry experience."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
