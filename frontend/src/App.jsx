import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import { 
  Users, CalendarCheck, History, ShieldCheck, UserPlus, Trash2,
  FileText, MessageCircle, Menu, MapPin, MapPinPlus, Plus, ChevronRight, CheckCircle2
} from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

// -------------------------------------------------------------
// SIDEBAR LAYOUT
// -------------------------------------------------------------
function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: '/', name: 'Assign Duty', icon: <CalendarCheck size={22} /> },
    { path: '/staff', name: 'Manage Staff', icon: <Users size={22} /> },
    { path: '/locations', name: 'Duty Locations', icon: <MapPin size={22} /> },
    { path: '/logs', name: 'Duty History', icon: <History size={22} /> },
  ];

  return (
    <div className="flex h-screen bg-slate-50 font-sans selection:bg-blue-200">
      <div className={`${isOpen ? 'w-72' : 'w-20'} transition-all duration-500 ease-in-out bg-gradient-to-b from-slate-900 to-slate-800 text-white flex flex-col shadow-2xl z-20`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-700/50">
          {isOpen && (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="bg-blue-500 p-2 rounded-lg shadow-lg shadow-blue-500/30">
                <ShieldCheck size={24} className="text-white"/>
              </div>
              <span className="font-bold text-xl tracking-wide">DutyCloud</span>
            </div>
          )}
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-400 hover:text-white transition-colors p-1 rounded-md hover:bg-slate-700/50">
            <Menu size={24} />
          </button>
        </div>
        
        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center p-3 rounded-xl transition-all duration-300 group
                  ${isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'} 
                  ${!isOpen && 'justify-center'}`}
              >
                <div className={`${isActive ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
                  {item.icon}
                </div>
                {isOpen && (
                  <span className="ml-4 font-medium flex-1 text-left">{item.name}</span>
                )}
                {isOpen && isActive && <ChevronRight size={18} className="opacity-70" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-50 via-slate-50 to-slate-100">
        <div className="p-8 max-w-7xl mx-auto animate-fade-in-up">
          {children}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MANAGE LOCATIONS COMPONENT
// -------------------------------------------------------------
function ManageLocations() {
  const [locList, setLocList] = useState([]);
  const [name, setName] = useState('');
  const [shift, setShift] = useState('General');

  useEffect(() => { fetchLocations(); }, []);

  const fetchLocations = async () => {
    const res = await axios.get(`${API_URL}/locations`);
    setLocList(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name) return;
    try {
      await axios.post(`${API_URL}/locations`, { name, shift });
      setName('');
      fetchLocations();
    } catch (err) {
      alert('Error adding location');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this location?')) {
      await axios.delete(`${API_URL}/locations/${id}`);
      fetchLocations();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Manage Locations</h2>
        <p className="text-slate-500 mt-1">Add specific duty posts assigned to specific shifts.</p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl">
        <h3 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
          <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600"><MapPinPlus size={20}/></div>
          Create New Post
        </h3>
        <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Location Name</label>
            <input type="text" required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none" placeholder="e.g. VIP Gate, Tower C" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="w-full md:w-64">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Assign to Shift</label>
            <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none font-medium text-slate-700" value={shift} onChange={e => setShift(e.target.value)}>
              <option>General</option>
              <option>Shift A</option>
              <option>Shift B</option>
              <option>Shift C</option>
            </select>
          </div>
          <button type="submit" className="w-full md:w-auto bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/30 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
            <Plus size={20} /> Add Post
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="p-5">Location Name</th>
              <th className="p-5">Assigned Shift</th>
              <th className="p-5 w-24 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {locList.map((l, i) => (
              <tr key={l._id} className="hover:bg-indigo-50/50 transition-colors group">
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-xs">{i+1}</div>
                    <span className="font-semibold text-slate-700">{l.name}</span>
                  </div>
                </td>
                <td className="p-5">
                  <span className="bg-slate-100 text-slate-600 font-bold text-xs px-3 py-1.5 rounded-lg border border-slate-200">{l.shift}</span>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleDelete(l._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
                </td>
              </tr>
            ))}
            {locList.length === 0 && <tr><td colSpan="3" className="p-12 text-center text-slate-400 font-medium">No locations available. Create one above!</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MANAGE STAFF COMPONENT
// -------------------------------------------------------------
function ManageStaff() {
  const [staffList, setStaffList] = useState([]);
  const [formData, setFormData] = useState({ staffId: '', fullName: '', category: 'Ex-Army', defaultWeekOff: 'Sunday' });

  useEffect(() => { fetchStaff(); }, []);

  const fetchStaff = async () => {
    const res = await axios.get(`${API_URL}/staff`);
    setStaffList(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/staff`, formData);
      setFormData({ staffId: '', fullName: '', category: 'Ex-Army', defaultWeekOff: 'Sunday' });
      fetchStaff();
    } catch (err) {
      alert('Error adding staff');
    }
  };

  const handleDelete = async (id) => {
    if(window.confirm('Delete this staff member?')) {
      await axios.delete(`${API_URL}/staff/${id}`);
      fetchStaff();
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Security Personnel</h2>
        <p className="text-slate-500 mt-1">Register new guards and manage existing workforce.</p>
      </div>
      
      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 transition-all hover:shadow-2xl">
        <h3 className="text-lg font-bold text-slate-700 mb-5 flex items-center gap-2">
          <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600"><UserPlus size={20}/></div>
          Enroll Staff Member
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 items-end">
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Staff ID</label>
            <input type="text" required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="e.g. S-105" value={formData.staffId} onChange={e => setFormData({...formData, staffId: e.target.value})} />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Full Name</label>
            <input type="text" required className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none" placeholder="John Doe" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} />
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Category</label>
            <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
              <option>Ex-Army</option><option>Civil Male</option><option>Civil Female</option>
            </select>
          </div>
          <div className="lg:col-span-1">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Week-Off</label>
            <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all outline-none font-medium" value={formData.defaultWeekOff} onChange={e => setFormData({...formData, defaultWeekOff: e.target.value})}>
              {['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'].map(day => <option key={day}>{day}</option>)}
            </select>
          </div>
          <button type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-xl hover:bg-emerald-700 font-bold shadow-lg shadow-emerald-600/30 transition-all hover:-translate-y-1 flex justify-center items-center gap-2">
            <Plus size={20}/> Add
          </button>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="p-5">ID</th>
              <th className="p-5">Staff Name</th>
              <th className="p-5">Category</th>
              <th className="p-5">Week Off</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map(s => (
              <tr key={s._id} className="hover:bg-emerald-50/50 transition-colors group">
                <td className="p-5 font-bold text-slate-600">{s.staffId}</td>
                <td className="p-5 font-semibold text-slate-800">{s.fullName}</td>
                <td className="p-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${s.category === 'Ex-Army' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.category}
                  </span>
                </td>
                <td className="p-5 text-slate-600 font-medium">{s.defaultWeekOff}</td>
                <td className="p-5 text-center">
                  <button onClick={() => handleDelete(s._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={20}/></button>
                </td>
              </tr>
            ))}
            {staffList.length === 0 && <tr><td colSpan="5" className="p-12 text-center text-slate-400 font-medium">No personnel found. Register staff above.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// DUTY ASSIGNMENT COMPONENT
// -------------------------------------------------------------
function AssignDuty() {
  const [staff, setStaff] = useState([]);
  const [allLocations, setAllLocations] = useState([]);
  const [dutyLogs, setDutyLogs] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [form, setForm] = useState({ staffId: '', shift: 'General', status: 'Present', location: '' });

  useEffect(() => { 
    fetchStaff();
    fetchLocations();
  }, []);
  
  useEffect(() => { fetchDutyLogsForDate(); }, [date]);

  const fetchStaff = async () => {
    const res = await axios.get(`${API_URL}/staff`);
    setStaff(res.data);
  };

  const fetchLocations = async () => {
    const res = await axios.get(`${API_URL}/locations`);
    setAllLocations(res.data);
  };

  // Filter locations dynamically based on selected shift
  const filteredLocations = useMemo(() => {
    return allLocations.filter(loc => loc.shift === form.shift);
  }, [allLocations, form.shift]);

  // Auto-select first location when shift changes
  useEffect(() => {
    if (filteredLocations.length > 0) {
      if (!filteredLocations.find(l => l.name === form.location)) {
        setForm(prev => ({ ...prev, location: filteredLocations[0].name }));
      }
    } else {
      setForm(prev => ({ ...prev, location: '' }));
    }
  }, [filteredLocations]);

  const fetchDutyLogsForDate = async () => {
    const res = await axios.get(`${API_URL}/duty?targetDate=${date}`);
    setDutyLogs(res.data);
  };

  const availableStaff = useMemo(() => {
    return staff.filter(s => {
       const logs = dutyLogs.filter(d => d.staff._id === s._id);
       return logs.length < 2; // Allow maximum 2 shifts (Regular + OT) per day
    });
  }, [staff, dutyLogs]);

  const handleStaffSelect = (e) => {
    const selectedId = e.target.value;
    const selectedStaff = staff.find(s => s._id === selectedId);
    let newStatus = 'Present';
    
    if (selectedStaff) {
      const targetDayName = format(parseISO(date), 'EEEE');
      const isWeekOff = selectedStaff.defaultWeekOff === targetDayName;
      
      const existingLogs = dutyLogs.filter(d => d.staff._id === selectedId);
      
      if (existingLogs.length > 0) {
        newStatus = isWeekOff ? 'WEEK OFF OT' : 'OT';
      } else {
        newStatus = isWeekOff ? 'Week Off' : 'Present';
      }
    }
    setForm({ ...form, staffId: selectedId, status: newStatus });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!form.staffId) return alert('Select staff');
    if(!form.location) return alert(`No locations exist for ${form.shift}. Go to Duty Locations menu and add one!`);
    
    // Collision Detection Logic
    const existingLogsForStaff = dutyLogs.filter(d => d.staff._id === form.staffId);
    
    if (existingLogsForStaff.some(d => d.shift === form.shift)) {
      return alert(`❌ COLLISION DETECTED: This person is already assigned to ${form.shift} today!`);
    }

    if (existingLogsForStaff.length > 0 && !form.status.includes('OT')) {
      return alert(`❌ INVALID STATUS: This person already has a regular shift today. Their second shift MUST be marked as OT!`);
    }
    
    try {
      await axios.post(`${API_URL}/duty`, {
        staff: form.staffId,
        targetDate: date,
        shift: form.shift,
        status: form.status,
        location: form.location
      });
      setForm({ staffId: '', shift: form.shift, status: 'Present', location: form.location });
      fetchDutyLogsForDate();
    } catch (err) {
      alert('Error assigning duty');
    }
  };

  const getLocCount = (loc) => dutyLogs.filter(d => d.location === loc).length;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Duty Commander</h2>
        <p className="text-slate-500 mt-1">Smart AI roster assignment with collision detection.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: ASSIGN FORM */}
        <div className="lg:col-span-4 bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 h-fit transition-all hover:shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
          
          <div className="mb-6 mt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Select Target Date</label>
            <input type="date" className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold text-slate-700 transition-all outline-none" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Personnel</label>
              <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700 transition-all outline-none cursor-pointer" value={form.staffId} onChange={handleStaffSelect}>
                <option value="">-- Choose Available Staff --</option>
                {availableStaff.map(s => <option key={s._id} value={s._id}>{s.staffId} - {s.fullName}</option>)}
              </select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Duty Status</label>
                <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-bold transition-all outline-none cursor-pointer" value={form.status} onChange={e => setForm({...form, status: e.target.value})}
                  style={{color: form.status === 'Week Off' ? '#ef4444' : form.status.includes('OT') ? '#8b5cf6' : '#10b981'}}
                >
                  <option>Present</option>
                  <option>Week Off</option>
                  <option>OT</option>
                  <option>WEEK OFF OT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Shift Timing</label>
                <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700 transition-all outline-none cursor-pointer" value={form.shift} onChange={e => setForm({...form, shift: e.target.value})}>
                  <option>General</option>
                  <option>Shift A</option>
                  <option>Shift B</option>
                  <option>Shift C</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Location / Post</label>
              <select className="w-full border-2 border-slate-200 p-3 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 font-medium text-slate-700 transition-all outline-none cursor-pointer" value={form.location} onChange={e => setForm({...form, location: e.target.value})}>
                {filteredLocations.length === 0 && <option value="">⚠️ No posts for this shift</option>}
                {filteredLocations.map(loc => (
                  <option key={loc._id} value={loc.name}>{loc.name} • {getLocCount(loc.name)} Assigned</option>
                ))}
              </select>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white p-4 rounded-xl hover:bg-blue-700 font-bold mt-6 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0" disabled={filteredLocations.length === 0}>
              Assign to Roster
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: ROSTER LIST */}
        <div className="lg:col-span-8 bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-[75vh] overflow-hidden">
          <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex justify-between items-center backdrop-blur-sm">
            <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
              <CalendarCheck className="text-blue-500" size={24}/>
              Roster for {format(parseISO(date), 'dd MMMM yyyy')}
            </h3>
            <span className="bg-blue-100 text-blue-700 text-sm font-bold px-4 py-1.5 rounded-full shadow-sm">
              {dutyLogs.length} Personnel Deployed
            </span>
          </div>
          
          <div className="flex-1 overflow-auto p-0">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="text-slate-400 text-xs font-bold uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 pl-6">Guard Details</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Shift</th>
                  <th className="p-4 pr-6">Post Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {dutyLogs.map(log => (
                  <tr key={log._id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-4 pl-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700">{log.staff?.fullName}</span>
                        <span className="text-xs text-slate-400 font-medium">{log.staff?.staffId}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 w-max shadow-sm ${
                        log.status === 'Present' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' :
                        log.status === 'Week Off' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-purple-100 text-purple-700 border border-purple-200'
                      }`}>
                        {log.status === 'Present' && <CheckCircle2 size={14}/>}
                        {log.status}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-slate-600">{log.shift}</td>
                    <td className="p-4 pr-6 font-bold text-slate-800 flex items-center gap-2">
                      <MapPin size={16} className="text-blue-400"/>
                      {log.location}
                    </td>
                  </tr>
                ))}
                {dutyLogs.length === 0 && (
                  <tr>
                    <td colSpan="4" className="p-16 text-center text-slate-400">
                      <div className="flex flex-col items-center gap-3">
                        <ShieldCheck size={48} className="text-slate-200"/>
                        <p className="font-medium text-lg">No personnel deployed yet.</p>
                        <p className="text-sm">Use the panel on the left to assign staff to posts.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

// -------------------------------------------------------------
// HISTORY, PDF & WHATSAPP COMPONENT
// -------------------------------------------------------------
function HistoryLogs() {
  const [logs, setLogs] = useState([]);
  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [search, setSearch] = useState('');

  const fetchLogs = async () => {
    const res = await axios.get(`${API_URL}/duty?startDate=${startDate}&endDate=${endDate}`);
    setLogs(res.data);
  };

  useEffect(() => { fetchLogs(); }, [startDate, endDate]);

  const handleDelete = async (id) => {
    if(window.confirm('Delete this duty record?')) {
      await axios.delete(`${API_URL}/duty/${id}`);
      fetchLogs();
    }
  };

  const filteredLogs = logs.filter(log => 
    log.staff?.fullName.toLowerCase().includes(search.toLowerCase()) || 
    log.location.toLowerCase().includes(search.toLowerCase())
  );

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text(`Official Duty Roster`, 14, 22);
    doc.setFontSize(11);
    doc.text(`Period: ${startDate} to ${endDate}`, 14, 30);
    
    let y = 40;
    filteredLogs.forEach((log, index) => {
      if(y > 270) { doc.addPage(); y = 20; }
      const text = `${index+1}. [${log.targetDate}] ${log.staff?.fullName} | ${log.status} | ${log.shift} | ${log.location}`;
      doc.text(text, 14, y);
      y += 8;
    });
    
    doc.save(`Roster_${startDate}_${endDate}.pdf`);
  };

  // ENHANCED WHATSAPP MESSAGE FORMATTING
  const generateWhatsApp = () => {
    let msg = `*🛡️ OFFICIAL SECURITY DUTY ROSTER*\n`;
    msg += `📅 *Date:* ${format(parseISO(startDate), 'dd MMM yyyy')}\n`;
    if (startDate !== endDate) {
      msg += `To: ${format(parseISO(endDate), 'dd MMM yyyy')}\n`;
    }
    msg += `➖➖➖➖➖➖➖➖➖➖\n\n`;

    filteredLogs.forEach((l, index) => {
      const staffId = l.staff?.staffId || 'UNKNOWN';
      const staffName = l.staff?.fullName ? l.staff.fullName.toUpperCase() : 'UNKNOWN';
      msg += `${index + 1}. *${staffId} - ${staffName}*\n`;
      msg += `└ Status: ${l.status} | ⏰ ${l.shift} | 📍 ${l.location.toUpperCase()}\n\n`;
    });
    
    msg += `➖➖➖➖➖➖➖➖➖➖\n`;
    msg += `✅ _Generated via DutyCloud Portal_`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Export & Logs</h2>
        <p className="text-slate-500 mt-1">Review historical data and distribute rosters via WhatsApp/PDF.</p>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row gap-6 items-end justify-between transition-all hover:shadow-2xl">
        <div className="flex flex-wrap gap-5 w-full md:w-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">From Date</label>
            <input type="date" className="border-2 border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold outline-none focus:border-blue-500 transition-colors" value={startDate} onChange={e => setStartDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">To Date</label>
            <input type="date" className="border-2 border-slate-200 p-2.5 rounded-xl text-slate-700 font-bold outline-none focus:border-blue-500 transition-colors" value={endDate} onChange={e => setEndDate(e.target.value)} />
          </div>
          <div className="flex-1 md:w-64">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Search Logs</label>
            <input type="text" placeholder="Search by name or location..." className="w-full border-2 border-slate-200 p-2.5 rounded-xl text-slate-700 outline-none focus:border-blue-500 transition-colors" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
        </div>
        
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button onClick={generateWhatsApp} className="flex-1 md:flex-none bg-[#25D366] hover:bg-[#1ebd5a] text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-[#25D366]/30 transition-all hover:-translate-y-1 active:scale-95">
            <MessageCircle size={20}/> Share WhatsApp
          </button>
          <button onClick={generatePDF} className="flex-1 md:flex-none bg-rose-500 hover:bg-rose-600 text-white px-6 py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-rose-500/30 transition-all hover:-translate-y-1 active:scale-95">
            <FileText size={20}/> Export PDF
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse text-sm">
          <thead>
            <tr className="bg-slate-50/80 text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <th className="p-5">Date</th>
              <th className="p-5">Guard Name</th>
              <th className="p-5">Post Location</th>
              <th className="p-5">Shift</th>
              <th className="p-5">Status</th>
              <th className="p-5 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map(log => (
              <tr key={log._id} className="hover:bg-slate-50/80 transition-colors group">
                <td className="p-5 whitespace-nowrap font-semibold text-slate-700">{format(parseISO(log.targetDate), 'dd MMM yy')}</td>
                <td className="p-5 font-bold text-slate-800">{log.staff?.fullName}</td>
                <td className="p-5 font-semibold text-blue-600">{log.location}</td>
                <td className="p-5 text-slate-600 font-medium">{log.shift}</td>
                <td className="p-5">
                  <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                    log.status === 'Present' ? 'bg-emerald-100 text-emerald-700' :
                    log.status === 'Week Off' ? 'bg-red-100 text-red-700' : 'bg-purple-100 text-purple-700'
                  }`}>{log.status}</span>
                </td>
                <td className="p-5 text-center">
                  <button onClick={() => handleDelete(log._id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
            {filteredLogs.length === 0 && <tr><td colSpan="6" className="p-12 text-center text-slate-400 font-medium">No records found for this criteria.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// MAIN APP COMPONENT
// -------------------------------------------------------------
function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AssignDuty />} />
          <Route path="/staff" element={<ManageStaff />} />
          <Route path="/locations" element={<ManageLocations />} />
          <Route path="/logs" element={<HistoryLogs />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
