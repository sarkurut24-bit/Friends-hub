import React, { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Settings, Plus, X, LogOut, User, Search, Camera } from 'lucide-react';

// Sirf aapka bataya hua group default rahega
const DEFAULT_GROUPS = [
  { id: 'grp-db-2025', name: 'CL 10 batch-2025 Don Bosco', emoji: '🏫', description: 'Official Batch Group', color: 'from-blue-600 to-indigo-600' }
];

export default function DonBoscoApp() {
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [friends, setFriends] = useState([]);
  const [groups, setGroups] = useState(DEFAULT_GROUPS);
  const [activeSection, setActiveSection] = useState('groups');
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(DEFAULT_GROUPS[0]); // Default group selected
  const [showNewGroupModal, setShowNewGroupModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [messages, setMessages] = useState({});
  const [messageText, setMessageText] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginName, setLoginName] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => { loadData(); }, []);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, selectedGroup]);

  const loadData = () => {
    const savedGroups = localStorage.getItem('dbapp:customGroups');
    if (savedGroups) setGroups([...DEFAULT_GROUPS, ...JSON.parse(savedGroups)]);
    
    const savedMsgs = localStorage.getItem('dbapp:messages');
    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
  };

  const handleLogin = () => {
    if (!loginName || !loginEmail) return alert('Details bhariye!');
    const user = { id: Date.now(), name: loginName, email: loginEmail };
    setCurrentUser(user);
    setShowLoginForm(false);
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const newGroup = {
      id: `grp_${Date.now()}`,
      name: newGroupName,
      emoji: '👥',
      color: 'from-purple-500 to-pink-500'
    };
    const updatedGroups = [...groups, newGroup];
    setGroups(updatedGroups);
    localStorage.setItem('dbapp:customGroups', JSON.stringify(updatedGroups.filter(g => g.id !== 'grp-db-2025')));
    setNewGroupName('');
    setShowNewGroupModal(false);
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;
    const key = selectedFriend ? `dm_${selectedFriend.id}` : `grp_${selectedGroup.id}`;
    const newMsg = {
      id: Date.now(),
      sender: currentUser.name,
      text: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    const updatedMsgs = { ...messages, [key]: [...(messages[key] || []), newMsg] };
    setMessages(updatedMsgs);
    localStorage.setItem('dbapp:messages', JSON.stringify(updatedMsgs));
    setMessageText('');
  };

  if (showLoginForm) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[#0f0c29]">
        <div className="w-full max-w-md bg-white/5 p-8 rounded-3xl border border-white/10 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl mx-auto mb-4 flex items-center justify-center text-3xl">🏫</div>
          <h1 className="text-3xl font-black text-white mb-6">Don Bosco Hub</h1>
          <input type="text" placeholder="Your Name" className="w-full p-3 mb-3 bg-white/10 rounded-xl text-white" onChange={e => setLoginName(e.target.value)} />
          <input type="email" placeholder="Email Address" className="w-full p-3 mb-6 bg-white/10 rounded-xl text-white" onChange={e => setLoginEmail(e.target.value)} />
          <button onClick={handleLogin} className="w-full py-3 bg-pink-500 rounded-xl font-bold text-white">Join Batch 2025</button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#0f0c29] text-white font-sans">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#1a1730]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-pink-500 rounded-lg">🏫</div>
          <h1 className="font-bold">Don Bosco Hub</h1>
        </div>
        <button onClick={() => setShowNewGroupModal(true)} className="p-2 bg-white/10 rounded-full hover:bg-pink-500 transition-colors">
          <Plus size={20} />
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-20 md:w-64 border-r border-white/10 bg-[#16132b]">
          <div className="p-4 space-y-4">
            {groups.map(g => (
              <button key={g.id} onClick={() => {setSelectedGroup(g); setSelectedFriend(null)}} 
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${selectedGroup?.id === g.id ? 'bg-pink-500' : 'hover:bg-white/5'}`}>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${g.color} flex items-center justify-center shrink-0`}>{g.emoji}</div>
                <span className="hidden md:block text-sm font-bold truncate">{g.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 bg-white/5 border-b border-white/10 font-bold text-center">
            {selectedGroup?.name}
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {(messages[selectedFriend ? `dm_${selectedFriend.id}` : `grp_${selectedGroup?.id}`] || []).map(m => (
              <div key={m.id} className={`flex flex-col ${m.sender === currentUser.name ? 'items-end' : 'items-start'}`}>
                <span className="text-[10px] text-gray-400 mb-1">{m.sender}</span>
                <div className={`p-3 rounded-2xl max-w-[80%] ${m.sender === currentUser.name ? 'bg-pink-600 rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}>
                  {m.text}
                  <div className="text-[9px] mt-1 opacity-50">{m.timestamp}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="p-4 flex gap-2">
            <input type="text" value={messageText} onChange={e => setMessageText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
              placeholder="Message group..." className="flex-1 bg-white/10 rounded-xl px-4 py-3 outline-none" />
            <button onClick={handleSendMessage} className="p-4 bg-pink-500 rounded-xl"><Send size={20}/></button>
          </div>
        </div>
      </div>

      {/* New Group Modal */}
      {showNewGroupModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-[#1a1730] p-6 rounded-3xl w-full max-w-sm border border-white/10">
            <h2 className="text-xl font-bold mb-4">Create New Group</h2>
            <input type="text" placeholder="Group Name..." className="w-full p-3 bg-white/10 rounded-xl mb-4 text-white" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
            <div className="flex gap-2">
              <button onClick={() => setShowNewGroupModal(false)} className="flex-1 py-3 rounded-xl bg-white/5">Cancel</button>
              <button onClick={handleCreateGroup} className="flex-1 py-3 rounded-xl bg-pink-500 font-bold">Create</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
