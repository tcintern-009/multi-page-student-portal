import InstructorsList from "@/components/InstructorsList";

export const metadata = {
  title: "Instructors | Student Course Portal",
  description: "Meet our expert instructors at Student Course Portal",
};

export default function InstructorsPage() {
  return (
    <div>
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

      <InstructorsList />
    </div>
  );
}
