import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { noteApi } from "../../services/noteApi";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  ArchiveBoxIcon,
  XMarkIcon,
  GlobeAltIcon,
  UserIcon,
  EnvelopeIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const NotesManagement = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    isGlobal: false,
    targetEmail: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailValid, setEmailValid] = useState(false);
  const [validatingEmail, setValidatingEmail] = useState(false);
  const [validatedUser, setValidatedUser] = useState(null);

  useEffect(() => {
    if (user?.id) {
      fetchNotes();
    }
  }, [user]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const response = await noteApi.getMyNotes(user.id);
      const notesData = response.content || response;
      setNotes(Array.isArray(notesData) ? notesData : []);
    } catch (err) {
      console.error("Error fetching notes:", err);
      setError(err.message || "Failed to fetch notes");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = async (email) => {
    if (!email || email.trim() === "") {
      setEmailError("");
      setEmailValid(false);
      setValidatedUser(null);
      return;
    }

    // Basic email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Invalid email format");
      setEmailValid(false);
      setValidatedUser(null);
      return;
    }

    setValidatingEmail(true);
    try {
      const result = await noteApi.validateApplicantByEmail(email, user.id);
      if (result && result.valid) {
        setEmailError("");
        setEmailValid(true);
        setValidatedUser(result);
      } else {
        setEmailError(result?.message || "No applicant found with this email");
        setEmailValid(false);
        setValidatedUser(null);
      }
    } catch (err) {
      setEmailError(err.message || "User not found");
      setEmailValid(false);
      setValidatedUser(null);
    } finally {
      setValidatingEmail(false);
    }
  };

  const handleEmailChange = (e) => {
    const email = e.target.value;
    setFormData({ ...formData, targetEmail: email });
    if (!email) {
      setEmailError("");
      setEmailValid(false);
      setValidatedUser(null);
    } else {
      // Debounce email validation
      const timeoutId = setTimeout(() => validateEmail(email), 500);
      return () => clearTimeout(timeoutId);
    }
  };

  const handleOpenModal = (note = null) => {
    if (note) {
      setEditingNote(note);
      const targetEmail = note.targetUser?.username || note.targetUserEmail || "";
      setFormData({
        title: note.title,
        content: note.content,
        isGlobal: note.isGlobal,
        targetEmail: targetEmail,
      });
      if (targetEmail) {
        setEmailValid(true);
        setEmailError("");
        setValidatedUser({ email: targetEmail, firstName: note.targetUser?.firstName, lastName: note.targetUser?.lastName });
      } else {
        setEmailValid(false);
        setValidatedUser(null);
      }
    } else {
      setEditingNote(null);
      setFormData({
        title: "",
        content: "",
        isGlobal: false,
        targetEmail: "",
      });
      setEmailValid(false);
      setEmailError("");
      setValidatedUser(null);
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingNote(null);
    setFormData({
      title: "",
      content: "",
      isGlobal: false,
      targetEmail: "",
    });
    setEmailValid(false);
    setEmailError("");
    setValidatedUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // For targeted notes, validate email first
    if (!formData.isGlobal && !emailValid) {
      alert("Please enter a valid applicant email address");
      return;
    }

    setSubmitting(true);

    let noteData = {
      title: formData.title,
      content: formData.content,
      isGlobal: formData.isGlobal,
    };

    // If not global, use email instead of user ID
    if (!formData.isGlobal && formData.targetEmail) {
      noteData.targetUserEmail = formData.targetEmail;
    }

    let result;
    if (editingNote) {
      result = await noteApi.updateNote(editingNote.id, noteData, user.id);
    } else {
      result = await noteApi.createNote(noteData, user.id);
    }

    if (result.success) {
      fetchNotes();
      handleCloseModal();
    } else {
      alert(result.error);
    }
    setSubmitting(false);
  };

  const handleDelete = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      const result = await noteApi.deleteNote(noteId, user.id);
      if (result.success) {
        fetchNotes();
      } else {
        alert(result.error);
      }
    }
  };

  const handleArchive = async (noteId) => {
    const result = await noteApi.archiveNote(noteId, user.id);
    if (result.success) {
      fetchNotes();
    } else {
      alert(result.error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notes Management</h1>
            <p className="mt-2 text-gray-600">
              Create and manage notifications for applicants
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 bg-[#0078AE] text-white rounded-lg hover:bg-[#005f8a] transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Create Note
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Notes Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-12 h-12 border-4 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No notes created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Title</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Target</th>
                    <th className="px-6 py-3">Created</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {notes.map((note) => (
                    <tr key={note.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{note.title}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {note.content?.substring(0, 60)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {note.isGlobal ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                            <GlobeAltIcon className="w-3 h-3" />
                            Global
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            <UserIcon className="w-3 h-3" />
                            Targeted
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {note.isGlobal ? (
                          "All Applicants"
                        ) : (
                          note.targetUserEmail || (note.targetUser ? `${note.targetUser.firstName} ${note.targetUser.lastName} (${note.targetUser.username})` : `User #${note.targetUserId}`)
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {formatDate(note.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          note.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                          {note.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenModal(note)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleArchive(note.id)}
                            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
                            title="Archive"
                          >
                            <ArchiveBoxIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(note.id)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {editingNote ? "Edit Note" : "Create New Note"}
              </h2>
              <button
                onClick={handleCloseModal}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <textarea
                  required
                  rows={6}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0078AE]"
                  placeholder="Enter note content..."
                />
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.isGlobal}
                    onChange={(e) => {
                      setFormData({ 
                        ...formData, 
                        isGlobal: e.target.checked, 
                        targetEmail: e.target.checked ? "" : formData.targetEmail 
                      });
                      if (e.target.checked) {
                        setEmailValid(false);
                        setEmailError("");
                        setValidatedUser(null);
                      }
                    }}
                    className="w-4 h-4 text-[#0078AE] rounded focus:ring-[#0078AE]"
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Global Note (visible to all applicants)
                  </span>
                </label>
              </div>

              {!formData.isGlobal && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applicant Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.targetEmail}
                      onChange={handleEmailChange}
                      className={`w-full pl-10 pr-10 border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0078AE] ${
                        emailError ? 'border-red-500' : emailValid ? 'border-green-500' : 'border-gray-300'
                      }`}
                      placeholder="applicant@example.com"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {validatingEmail && (
                        <div className="w-5 h-5 border-2 border-[#0078AE] border-t-transparent rounded-full animate-spin"></div>
                      )}
                      {!validatingEmail && emailValid && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {!validatingEmail && emailError && !emailValid && formData.targetEmail && (
                        <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                  {emailValid && validatedUser && (
                    <p className="mt-1 text-sm text-green-600">
                      ✓ Valid applicant: {validatedUser.firstName} {validatedUser.lastName}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-gray-500">
                    Enter the applicant's email address (username) to send this note specifically to them.
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={submitting || (!formData.isGlobal && !emailValid)}
                  className="flex-1 bg-[#0078AE] text-white px-4 py-2 rounded-lg hover:bg-[#005f8a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Saving..." : editingNote ? "Update Note" : "Create Note"}
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesManagement;