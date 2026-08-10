"use client";

import { useState } from "react";

const emptyForm = {
  title: "",
  category: "",
  description: "",
  instructor: "",
  duration: "",
  level: "",
  price: "",
  topics: "",
};

export default function CourseForm({
  initialData,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [formData, setFormData] = useState(
    initialData
      ? {
          title: initialData.title || "",
          category: initialData.category || "",
          description: initialData.description || "",
          instructor: initialData.instructor || "",
          duration: initialData.duration || "",
          level: initialData.level || "",
          price: initialData.price ?? "",
          topics: Array.isArray(initialData.topics)
            ? initialData.topics.join(", ")
            : "",
        }
      : emptyForm,
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = "Title is required";
    if (!formData.category.trim()) errs.category = "Category is required";
    if (!formData.instructor.trim()) errs.instructor = "Instructor is required";
    if (!formData.description.trim())
      errs.description = "Description is required";
    if (
      formData.price !== "" &&
      (isNaN(Number(formData.price)) || Number(formData.price) < 0)
    ) {
      errs.price = "Price must be a non-negative number";
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    onSubmit({
      ...(initialData ? { ...initialData } : {}),
      title: formData.title.trim(),
      category: formData.category.trim(),
      description: formData.description.trim(),
      instructor: formData.instructor.trim(),
      duration: formData.duration.trim() || "12 weeks",
      level: formData.level.trim() || "Beginner",
      price: formData.price !== "" ? Number(formData.price) : 99,
      topics: formData.topics
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    });
  };

  const input =
    "w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm";
  const label = "block text-sm font-medium text-gray-700 mb-1.5";
  const err = (f) =>
    errors[f] ? <p className="mt-1 text-sm text-red-600">{errors[f]}</p> : null;

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl border border-gray-200 shadow-sm p-6"
    >
      <h3 className="text-xl font-bold text-gray-900 mb-6">
        {initialData ? "Edit Course" : "Add New Course"}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="md:col-span-2">
          <label className={label} htmlFor="title">
            Course Title *
          </label>
          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. React Masterclass"
            className={input}
          />
          {err("title")}
        </div>
        <div>
          <label className={label} htmlFor="category">
            Category *
          </label>
          <input
            id="category"
            name="category"
            type="text"
            value={formData.category}
            onChange={handleChange}
            placeholder="e.g. Programming"
            className={input}
          />
          {err("category")}
        </div>
        <div>
          <label className={label} htmlFor="instructor">
            Instructor *
          </label>
          <input
            id="instructor"
            name="instructor"
            type="text"
            value={formData.instructor}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            className={input}
          />
          {err("instructor")}
        </div>
        <div className="md:col-span-2">
          <label className={label} htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            placeholder="A brief summary of the course..."
            className={input}
          />
          {err("description")}
        </div>
        <div>
          <label className={label} htmlFor="duration">
            Duration
          </label>
          <input
            id="duration"
            name="duration"
            type="text"
            value={formData.duration}
            onChange={handleChange}
            placeholder="e.g. 12 weeks"
            className={input}
          />
        </div>
        <div>
          <label className={label} htmlFor="level">
            Level
          </label>
          <select
            id="level"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className={input}
          >
            <option value="">Select level...</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Beginner to Intermediate">
              Beginner to Intermediate
            </option>
            <option value="All Levels">All Levels</option>
          </select>
        </div>
        <div>
          <label className={label} htmlFor="price">
            Price ($)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={handleChange}
            placeholder="e.g. 149"
            className={input}
          />
          {err("price")}
        </div>
        <div className="md:col-span-2">
          <label className={label} htmlFor="topics">
            Topics (comma-separated)
          </label>
          <input
            id="topics"
            name="topics"
            type="text"
            value={formData.topics}
            onChange={handleChange}
            placeholder="HTML, CSS, JavaScript, React"
            className={input}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mt-6">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting
            ? initialData
              ? "Updating..."
              : "Adding..."
            : initialData
              ? "Update Course"
              : "Add Course"}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={submitting}
            className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
