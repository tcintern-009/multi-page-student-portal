import CourseDetail from "@/components/CourseDetail";

export const metadata = {
  title: "Course Details | Student Course Portal",
  description: "View course details",
};

export default async function CourseDetailPage({ params }) {
  const { slug } = await params;

  return <CourseDetail slug={slug} />;
}
