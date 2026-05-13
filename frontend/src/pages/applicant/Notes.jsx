import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { noteApi } from "../../services/noteApi";
import {
  BellIcon,
  DocumentTextIcon,
  UserCircleIcon,
  CalendarIcon,
  EyeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

const Notes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedNote, setSelectedNote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchNotes();
    // Mark all notifications as viewed when this page loads
    if (user?.id) {
      localStorage.setItem(`notifications_last_viewed_${user.id}`, new Date().toISOString());
    }
  }, [user?.id]);

  const fetchNotes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await noteApi.getMyNotesAsApplicant(user?.id);
      // Check if response has content array or is directly the array
      const notesData = response.content || response;
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getNoteIcon = (note) => {
    if (note.isGlobal) {
      return <BellIcon className="w-10 h-10 text-blue-500" />;
    }
    return <DocumentTextIcon className="w-10 h-10 text-green-500" />;
  };

  const handleViewNote = (note) => {
    setSelectedNote(note);
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3">
            <BellIcon className="w-8 h-8 text-[#0078AE]" />
            <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          </div>
          <p className="mt-2 text-gray-600 ml-11">
            Important updates and messages about your application
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-12 h-12 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Notes List */}
        {!loading && !error && (
          <div className="space-y-4">
            {notes.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                <BellIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No notifications yet
                </h3>
                <p className="text-gray-500">
                  When you receive notifications, they will appear here
                </p>
              </div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
                >
                  <div className="p-5">
                    <div className="flex gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0">
                        {getNoteIcon(note)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {note.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <UserCircleIcon className="w-4 h-4" />
                                From: {note.authorName || "System"}
                              </span>
                              <span className="flex items-center gap-1">
                                <CalendarIcon className="w-4 h-4" />
                                {formatDate(note.createdAt)}
                              </span>
                              {note.isGlobal && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  Global Announcement
                                </span>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleViewNote(note)}
                            className="flex items-center gap-1 px-3 py-1.5 text-[#0078AE] hover:bg-[#0078AE]/10 rounded-lg transition-colors"
                          >
                            <EyeIcon className="w-4 h-4" />
                            <span className="text-sm font-medium">View</span>
                          </button>
                        </div>

                        {/* Preview */}
                        <p className="mt-2 text-gray-600 line-clamp-2">
                          {note.content}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Note Details Modal */}
      {showModal && selectedNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                {getNoteIcon(selectedNote)}
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedNote.title}
                  </h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                    <span>From: {selectedNote.authorName || "System"}</span>
                    <span>•</span>
                    <span>{formatDate(selectedNote.createdAt)}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="prose max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {selectedNote.content}
                </p>
              </div>
              {selectedNote.isGlobal && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    This is a global announcement visible to all applicants.
                  </p>
                </div>
              )}
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="w-full px-4 py-2 bg-[#0078AE] text-white rounded-lg hover:bg-[#005f8a] transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;