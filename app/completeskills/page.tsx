"use client";
import { useState } from "react";
import {
  Code,
  Heart,
  Target,
  ArrowRight,
  SkipForward,
  Check,
  Plus,
  X,
  Search,
  Brain,
} from "lucide-react";


// Simulated axios function - no real API calls
const axiosWithCsrf = {
  post: async (url: any, data: any) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log("Skills & interests saved:", data);
        resolve({ data: { success: true } });
      }, 1500);
    });
  },
};

interface SkillsInterests {
  skills: string[];
  interests: string[];
  hobbies: string[];
  skill_level: { [key: string]: string };
  career_goals: string;
  learning_preferences: string[];
}

export default function SkillsInterestsSetup() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);


  const [data, setData] = useState<SkillsInterests>({
    skills: [],
    interests: [],
    hobbies: [],
    skill_level: {},
    career_goals: "",
    learning_preferences: [],
  });

  // Predefined options
  const POPULAR_SKILLS = [
    "JavaScript",
    "Python",
    "React",
    "Node.js",
    "HTML/CSS",
    "Java",
    "C++",
    "PHP",
    "Machine Learning",
    "Data Analysis",
    "UI/UX Design",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Cybersecurity",
    "Database Management",
    "Project Management",
    "Digital Marketing",
    "Content Writing",
    "Photography",
  ];

  const POPULAR_INTERESTS = [
    "Technology",
    "Artificial Intelligence",
    "Startups",
    "Entrepreneurship",
    "Web Development",
    "Mobile Apps",
    "Gaming",
    "Blockchain",
    "IoT",
    "Data Science",
    "Cybersecurity",
    "Cloud Computing",
    "Open Source",
    "Design",
    "Music",
    "Travel",
    "Sports",
    "Reading",
    "Movies",
    "Art",
  ];

  const POPULAR_HOBBIES = [
    "Coding",
    "Reading",
    "Gaming",
    "Music",
    "Photography",
    "Drawing",
    "Writing",
    "Cooking",
    "Traveling",
    "Sports",
    "Fitness",
    "Dancing",
    "Singing",
    "Playing Instruments",
    "Gardening",
    "Crafting",
    "Hiking",
    "Swimming",
    "Cycling",
    "Volunteering",
    "Learning Languages",
    "Chess",
  ];

  const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

  const LEARNING_PREFERENCES = [
    "Video Tutorials",
    "Written Documentation",
    "Hands-on Practice",
    "Online Courses",
    "Bootcamps",
    "Mentorship",
    "Peer Learning",
    "Books",
    "Workshops",
    "Conferences",
  ];

  const totalSteps = 4;

  // Custom input states
  const [skillInput, setSkillInput] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [hobbyInput, setHobbyInput] = useState("");

  const handleAddCustom = (
    type: "skills" | "interests" | "hobbies",
    value: string
  ) => {
    if (value.trim() && !data[type].includes(value.trim())) {
      setData((prev) => ({
        ...prev,
        [type]: [...prev[type], value.trim()],
      }));

      // Clear input
      if (type === "skills") setSkillInput("");
      if (type === "interests") setInterestInput("");
      if (type === "hobbies") setHobbyInput("");
    }
  };

  const handleToggleItem = (
    type: "skills" | "interests" | "hobbies" | "learning_preferences",
    item: string
  ) => {
    setData((prev) => ({
      ...prev,
      [type]: prev[type].includes(item)
        ? prev[type].filter((i) => i !== item)
        : [...prev[type], item],
    }));
  };

  // ...existing code...
  const handleRemoveItem = (
    type: "skills" | "interests" | "hobbies",
    item: string
  ) => {
    setData((prev) => {
      const newState = {
        ...prev,
        [type]: prev[type].filter((i) => i !== item),
      };
      if (type === "skills") {
        // Remove the skill from skill_level
        const { [item]: _, ...restSkillLevel } = prev.skill_level;
        newState.skill_level = restSkillLevel;
      }
      return newState;
    });
  };
  // ...existing code...

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    console.log("Skills & interests setup skipped");
    setIsCompleted(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axiosWithCsrf.post("/save-skills-interests/", data);
      setIsCompleted(true);
    } catch (error) {
      console.error("Failed to save skills & interests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStepProgress = () => (currentStep / totalSteps) * 100;

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return data.skills.length > 0;
      case 2:
        return data.interests.length > 0;
      case 3:
        return data.hobbies.length > 0;
      case 4:
        return true; // Optional step
      default:
        return false;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold flex justify-center items-center gap-2 text-gray-900 mb-4">Awesome! <Brain className="w-9 h-9 text-green-600" /></h2>
          <p className="text-gray-600 mb-8">
            Your skills and interests have been saved. We'll use this to
            personalize your experience!
          </p>
          <button
            onClick={() => location.href = "/dashboard"}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-300 transform hover:scale-105"
          >
            Explore Platform
          </button>
        </div>
      </div>
    );
  }

    function handleSkillLevel(skill: string, level: string): void {
        throw new Error("Function not implemented.");
    }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Share Your Passions</h1>
              <p className="text-purple-100">
                Step {currentStep} of {totalSteps} - Let's discover what drives
                you
              </p>
            </div>
            <button
              onClick={handleSkip}
              className="flex items-center gap-2 text-purple-100 hover:text-white transition-colors"
            >
              <SkipForward className="w-4 h-4" />
              Skip for now
            </button>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-purple-400 rounded-full h-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{ width: `${getStepProgress()}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Code className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What are your skills?
                </h2>
                <p className="text-gray-600">
                  Add your technical and professional skills
                </p>
              </div>

              {/* Custom Skill Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    placeholder="Add a custom skill..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" && handleAddCustom("skills", skillInput)
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddCustom("skills", skillInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Skills */}
              {data.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Skills:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {skill}
                        <button
                          onClick={() => handleRemoveItem("skills", skill)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Skills */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Popular Skills:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {POPULAR_SKILLS.map((skill) => (
                    <button
                      key={skill}
                      onClick={() => handleToggleItem("skills", skill)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.skills.includes(skill)
                          ? "bg-purple-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Target className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What interests you?
                </h2>
                <p className="text-gray-600">
                  Select topics and areas you're passionate about
                </p>
              </div>

              {/* Custom Interest Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={interestInput}
                    onChange={(e) => setInterestInput(e.target.value)}
                    placeholder="Add a custom interest..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddCustom("interests", interestInput)
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddCustom("interests", interestInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Interests */}
              {data.interests.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Interests:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.interests.map((interest) => (
                      <span
                        key={interest}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-800 rounded-full text-sm"
                      >
                        {interest}
                        <button
                          onClick={() =>
                            handleRemoveItem("interests", interest)
                          }
                          className="text-pink-600 hover:text-pink-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Interests */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Popular Interests:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {POPULAR_INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      onClick={() => handleToggleItem("interests", interest)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.interests.includes(interest)
                          ? "bg-pink-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <Heart className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  What are your hobbies?
                </h2>
                <p className="text-gray-600">
                  Tell us what you love doing in your free time
                </p>
              </div>

              {/* Custom Hobby Input */}
              <div className="flex gap-2 mb-6">
                <div className="relative flex-1">
                  <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    value={hobbyInput}
                    onChange={(e) => setHobbyInput(e.target.value)}
                    placeholder="Add a custom hobby..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                    onKeyPress={(e) =>
                      e.key === "Enter" &&
                      handleAddCustom("hobbies", hobbyInput)
                    }
                  />
                </div>
                <button
                  onClick={() => handleAddCustom("hobbies", hobbyInput)}
                  className="px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              {/* Selected Hobbies */}
              {data.hobbies.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">
                    Your Hobbies:
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {data.hobbies.map((hobby) => (
                      <span
                        key={hobby}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-800 rounded-full text-sm"
                      >
                        {hobby}
                        <button
                          onClick={() => handleRemoveItem("hobbies", hobby)}
                          className="text-indigo-600 hover:text-indigo-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Hobbies */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 mb-3">
                  Popular Hobbies:
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {POPULAR_HOBBIES.map((hobby) => (
                    <button
                      key={hobby}
                      onClick={() => handleToggleItem("hobbies", hobby)}
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.hobbies.includes(hobby)
                          ? "bg-indigo-600 text-white shadow-lg transform scale-105"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {hobby}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Let's personalize your experience
                </h2>
                <p className="text-gray-600">
                  Help us understand your goals and preferences
                </p>
              </div>

              {/* Skill Levels */}
              {data.skills.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Rate your skill levels:
                  </h3>
                  <div className="space-y-4">
                    {data.skills.slice(0, 5).map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                      >
                        <span className="font-medium text-gray-900">
                          {skill}
                        </span>
                        <div className="flex gap-2">
                          {SKILL_LEVELS.map((level) => (
                            <button
                              key={level}
                              onClick={() => handleSkillLevel(skill, level)}
                              className={`px-3 py-1 text-xs font-medium rounded-full transition-all ${
                                data.skill_level[skill] === level
                                  ? "bg-purple-600 text-white"
                                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                              }`}
                            >
                              {level}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Career Goals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  What are your career goals?
                </h3>
                <textarea
                  value={data.career_goals}
                  onChange={(e) =>
                    setData((prev) => ({
                      ...prev,
                      career_goals: e.target.value,
                    }))
                  }
                  placeholder="Share your career aspirations and goals..."
                  rows={4}
                  className="w-full p-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all resize-none"
                />
              </div>

              {/* Learning Preferences */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  How do you prefer to learn?
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {LEARNING_PREFERENCES.map((pref) => (
                    <button
                      key={pref}
                      onClick={() =>
                        handleToggleItem("learning_preferences", pref)
                      }
                      className={`p-3 text-sm font-medium rounded-xl transition-all ${
                        data.learning_preferences.includes(pref)
                          ? "bg-purple-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-12">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`px-6 py-3 rounded-2xl font-semibold transition-all ${
                currentStep === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Previous
            </button>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <button
                  onClick={handleSkip}
                  className="px-6 py-3 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  Skip this step
                </button>
              )}

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className={`flex items-center gap-2 px-8 py-3 rounded-2xl font-semibold transition-all ${
                    isStepValid()
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 transform hover:scale-105"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      Complete Setup
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Step Indicators */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i + 1 <= currentStep
                    ? "bg-gradient-to-r from-purple-600 to-pink-600"
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
