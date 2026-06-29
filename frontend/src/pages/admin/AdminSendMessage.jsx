// src/components/Admin/AdminSendMessage.jsx

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Send, Users, Mail, CheckCircle, AlertCircle, Star, X, MessageSquare, Clock } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const AdminSendMessage = () => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [sentMessages, setSentMessages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    fetchStudents();
    fetchSentMessages();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/admin/students`, getAuthHeaders());
      setStudents(response.data.students || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching students:', err);
      setLoading(false);
    }
  };

  const fetchSentMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_URL}/messages`, getAuthHeaders());
      setSentMessages(response.data.messages || []);
    } catch (err) {
      console.error('Error fetching sent messages:', err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!selectedStudent) {
      setError('Please select a student');
      setTimeout(() => setError(''), 3000);
      return;
    }
    
    if (!message.trim()) {
      setError('Please enter a message');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setSending(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      await axios.post(`${API_URL}/messages/send`, {
        student_id: parseInt(selectedStudent),
        subject: subject.trim() || 'Message from Admin',
        message: message.trim(),
        is_important: isImportant,
        sender_name: 'Admin',
        sender_role: 'admin'
      }, getAuthHeaders());

      setSuccess('✅ Message sent successfully!');
      setSubject('');
      setMessage('');
      setIsImportant(false);
      setSelectedStudent('');
      fetchSentMessages();
      
      // Close modal after success
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 2000);
      
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err.response?.data?.error || 'Failed to send message');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSending(false);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
    setError('');
    setSuccess('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setError('');
    setSuccess('');
  };

  return (
    <div className="space-y-6">
      {/* ===== SEND MESSAGE BUTTON ===== */}
      <div className="flex justify-end">
        <button
          onClick={openModal}
          className="bg-[#F5831F] text-white px-6 py-2.5 rounded-xl hover:bg-[#e0731a] transition flex items-center gap-2 shadow-md hover:shadow-lg"
        >
          <Send className="w-4 h-4" />
          Send New Message
        </button>
      </div>

      {/* ===== SENT MESSAGES ===== */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-[#F5831F]" />
            Sent Messages
          </h3>
          <span className="text-sm text-gray-400">{sentMessages.length} total</span>
        </div>
        
        {sentMessages.length > 0 ? (
          <div className="space-y-3">
            {sentMessages.slice(0, 10).map((msg) => (
              <div key={msg.id} className={`flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition ${msg.is_important ? 'border-l-4 border-l-[#F5831F]' : 'border-gray-100'}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-gray-900 text-sm">{msg.subject || 'No subject'}</p>
                    {msg.is_important && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-[#F5831F]/20 text-[#F5831F] font-medium">⭐ Important</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">To: {msg.student_name || 'Student'}</p>
                  <p className="text-xs text-gray-400">{msg.time_ago || 'Just now'}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${msg.is_read ? 'bg-gray-100 text-gray-600' : 'bg-[#F5831F]/20 text-[#F5831F]'}`}>
                  {msg.is_read ? '✅ Read' : '⏳ Unread'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-400 text-sm">
            <MessageSquare className="w-12 h-12 mx-auto text-gray-300 mb-2" />
            No messages sent yet
          </div>
        )}
      </div>

      {/* ===== SEND MESSAGE MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#F5831F]/10 rounded-xl flex items-center justify-center">
                  <Send className="w-5 h-5 text-[#F5831F]" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Send Message</h2>
                  <p className="text-sm text-gray-500">Send a message to a student</p>
                </div>
              </div>
              <button onClick={closeModal} className="p-2 hover:bg-gray-100 rounded-xl transition text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-6">
              {success && (
                <div className="bg-green-50 text-green-700 p-3 rounded-xl border border-green-200 flex items-center gap-2 mb-4">
                  <CheckCircle className="w-5 h-5" />
                  <span>{success}</span>
                </div>
              )}

              {error && (
                <div className="bg-red-50 text-red-700 p-3 rounded-xl border border-red-200 flex items-center gap-2 mb-4">
                  <AlertCircle className="w-5 h-5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSendMessage} className="space-y-4">
                {/* Select Student */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#F5831F]" />
                    Select Student *
                  </label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white"
                    required
                  >
                    <option value="">Select a student...</option>
                    {students.map((student) => (
                      <option key={student.id} value={student.id}>
                        {student.full_name} ({student.email}) - {student.unread_count} unread
                      </option>
                    ))}
                  </select>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5 flex items-center gap-2">
                    <Mail className="w-4 h-4 text-[#F5831F]" />
                    Subject
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Enter message subject..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Message *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    placeholder="Write your message here..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F5831F] focus:border-transparent transition bg-gray-50 focus:bg-white resize-none"
                    required
                  />
                </div>

                {/* Important Toggle */}
                <div className="flex items-center gap-3">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:ring-2 peer-focus:ring-[#F5831F] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#F5831F]"></div>
                  </label>
                  <div className="flex items-center gap-1.5">
                    <Star className={`w-4 h-4 ${isImportant ? 'text-[#F5831F]' : 'text-gray-400'}`} />
                    <span className="text-sm text-gray-600">Mark as Important</span>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`flex-1 bg-[#F5831F] text-white py-3 rounded-xl hover:bg-[#e0731a] transition font-medium flex items-center justify-center gap-2 shadow-md hover:shadow-lg ${
                      sending ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Send Message
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSendMessage;