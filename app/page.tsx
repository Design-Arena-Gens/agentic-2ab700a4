"use client";

import { useState } from "react";

export default function Home() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState("professional");
  const [length, setLength] = useState("medium");
  const [loading, setLoading] = useState(false);
  const [generatedPost, setGeneratedPost] = useState("");
  const [error, setError] = useState("");

  const generatePost = async () => {
    if (!topic.trim()) {
      setError("Please enter a topic");
      return;
    }

    setLoading(true);
    setError("");
    setGeneratedPost("");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, tone, length }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate post");
      }

      setGeneratedPost(data.post);
    } catch (err: any) {
      setError(err.message || "Failed to generate post");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-blue-600 mb-4">
            LinkedIn Post Agent
          </h1>
          <p className="text-gray-600 text-lg">
            AI-powered LinkedIn content generator
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Topic
              </label>
              <textarea
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="What do you want to post about? (e.g., 'AI in healthcare', 'leadership lessons', 'career growth tips')"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tone
                </label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="inspirational">Inspirational</option>
                  <option value="educational">Educational</option>
                  <option value="storytelling">Storytelling</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="short">Short (100-150 words)</option>
                  <option value="medium">Medium (150-250 words)</option>
                  <option value="long">Long (250-400 words)</option>
                </select>
              </div>
            </div>

            <button
              onClick={generatePost}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-lg transition-colors"
            >
              {loading ? "Generating..." : "Generate Post"}
            </button>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}
          </div>
        </div>

        {generatedPost && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                Generated Post
              </h2>
              <button
                onClick={copyToClipboard}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Copy
              </button>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed border-l-4 border-blue-500 pl-4">
                {generatedPost}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
