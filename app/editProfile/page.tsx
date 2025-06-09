"use client";

import { useEffect, useState } from "react";
import { axiosWithCsrf } from "@/lib/axiosWithCsrf";
import { useRouter } from "next/navigation";
import BackButton from "@/components/BackButton";
import { CameraIcon } from "lucide-react";

export default function EditProfilePage() {
  const [form, setForm] = useState({
    full_name: "",
    lcid: "",
    phone_number: "",
    section: "",
    faculty: "",
    semester: "",
    program: "",
    profile_pic: null as File | null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  // Fetch and populate existing profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosWithCsrf.get("/api/get-profile/");
        const data = res.data;

        setForm((prev) => ({
          ...prev,
          full_name: data.full_name || "",
          lcid: data.lcid || "",
          phone_number: data.phone_number || "",
          section: data.section || "",
          semester: data.semester || "",
          faculty: data.faculty || "",
          program: data.program || "",
        }));

        if (data.profile_pic) {
          setPreview(BASE_URL + data.profile_pic);
        }
      } catch (err) {
        setError("Failed to fetch profile.");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;

    if (name === "profile_pic" && files?.[0]) {
      const file = files[0];
      setPreview(URL.createObjectURL(file));
      setForm((prev) => ({ ...prev, profile_pic: file }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    for (const key in form) {
      if (key !== "profile_pic" && !form[key as keyof typeof form]) {
        setError(`Please fill in the ${key.replace("_", " ")}`);
        return;
      }
    }

    setLoading(true);

    try {
      const formData = new FormData();
      for (const key in form) {
        if (key === "profile_pic" && form.profile_pic) {
          formData.append("profile_pic", form.profile_pic);
        } else {
          const value = form[key as keyof typeof form];
          if (typeof value === "string") {
            formData.append(key, value);
          }
        }
      }

      await axiosWithCsrf.post("/api/edit-profile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Profile updated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Profile update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-lg mt-1.5">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        Edit Profile
      </h1>
      <BackButton />

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      {/* Profile Pic Upload Box */}
      <div className="flex justify-center mb-6">
        <div className="flex justify-center bg-gray-50 p-2.5 shadow-md rounded-xl">
          <label className="relative w-40 h-40 border-2 border-dashed rounded-xl cursor-pointer overflow-hidden bg-gray-50 hover:bg-gray-100 transition">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-gray-400">
                <CameraIcon size={40} />
              </div>
            )}
            <input
              type="file"
              name="profile_pic"
              accept="image/*"
              onChange={handleChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="lcid"
            placeholder="LCID"
            value={form.lcid}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester"
            value={form.semester}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="section"
            placeholder="Section"
            value={form.section}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="faculty"
            placeholder="Faculty"
            value={form.faculty}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
          <input
            type="text"
            name="program"
            placeholder="Program"
            value={form.program}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg p-2"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
}
