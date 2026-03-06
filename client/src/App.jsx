import React, { useState, useEffect } from "react";

function App() {
  const [skills, setSkills] = useState([]);
  const [expTimeline, setExpTimeline] = useState([]);
  const [activeExp, setActiveExp] = useState(null);
  const [education, setEducation] = useState([]);
  const [certifications, setCertifications] = useState([]);

  const [aiBio, setAiBio] = useState('Career goals have not been added yet.');
  const [isGenerating, setIsGenerating] = useState(false);

  const [profile, setProfile] = useState({ name: 'Thanushree Vijayakanth', email: 'thanushree1866@gmail.com' });

  // Section editing state
  const [editSection, setEditSection] = useState(null);

  // Form states
  const [editForm, setEditForm] = useState({ name: '', email: '', bio: '' });
  const [formText, setFormText] = useState('');

  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const fetchProfile = () => {
    fetch('http://localhost:5000/api/profile')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setProfile({ name: data.name, email: data.email });
          if (data.bio) setAiBio(data.bio);
          if (data.skills) setSkills(data.skills.sort((a, b) => b.endorsements - a.endorsements));
          if (data.workExperience) {
            setExpTimeline(data.workExperience);
            if (data.workExperience.length > 0) setActiveExp(data.workExperience[0].id);
          }
          if (data.education) setEducation(data.education);
          if (data.certifications) setCertifications(data.certifications);
        }
      })
      .catch(err => console.error("Error fetching profile", err));
  };

  const handleEditClick = (section) => {
    setEditSection(section);
    if (section === 'profile') {
      setEditForm({ name: profile.name, email: profile.email, bio: aiBio });
    } else if (section === 'skills') {
      setFormText(JSON.stringify(skills, null, 2));
    } else if (section === 'experience') {
      setFormText(JSON.stringify(expTimeline, null, 2));
    } else if (section === 'education') {
      setFormText(JSON.stringify(education, null, 2));
    } else if (section === 'certifications') {
      setFormText(JSON.stringify(certifications, null, 2));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    let payload = {};
    if (editSection === 'profile') {
      payload = { ...editForm };
    } else {
      try {
        const parsed = JSON.parse(formText);
        if (editSection === 'skills') payload = { skills: parsed };
        if (editSection === 'experience') payload = { workExperience: parsed };
        if (editSection === 'education') payload = { education: parsed };
        if (editSection === 'certifications') payload = { certifications: parsed };
      } catch (err) {
        alert("Invalid JSON format. Please ensure the data is correct.");
        return;
      }
    }

    try {
      const res = await fetch('http://localhost:5000/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (editSection === 'profile') {
        setProfile({ name: data.name, email: data.email });
        setAiBio(data.bio);
      } else if (editSection === 'skills') {
        setSkills(data.skills.sort((a, b) => b.endorsements - a.endorsements));
      } else if (editSection === 'experience') {
        setExpTimeline(data.workExperience);
        if (data.workExperience && data.workExperience.length > 0) setActiveExp(data.workExperience[0].id);
      } else if (editSection === 'education') {
        setEducation(data.education);
      } else if (editSection === 'certifications') {
        setCertifications(data.certifications);
      }

      setEditSection(null);
    } catch (err) {
      console.error("Error saving profile", err);
    }
  };

  const toggleEndorsement = (index) => {
    setSkills(prev => {
      const newSkills = [...prev];
      if (newSkills[index].endorsedByMe) {
        newSkills[index].endorsements -= 1;
        newSkills[index].endorsedByMe = false;
      } else {
        newSkills[index].endorsements += 1;
        newSkills[index].endorsedByMe = true;
      }
      return newSkills.sort((a, b) => b.endorsements - a.endorsements);
    });
  };

  const generateBio = () => {
    if (isGenerating) return;
    setIsGenerating(true);
    setAiBio('');
    const fullBio = "Passionate and detail-oriented Software Developer with a knack for building dynamic, user-centric web applications. Specializing in modern JavaScript frameworks and beautifully responsive design, I thrive at the cross-section of pixel-perfect UI and robust application architecture. Driven by curiosity and a desire to continuously innovate.";

    let i = 0;
    const interval = setInterval(() => {
      setAiBio(fullBio.slice(0, i + 1));
      i++;
      if (i >= fullBio.length) {
        clearInterval(interval);
        setIsGenerating(false);
      }
    }, 15);
  };

  return (
    <div className="min-h-screen bg-[#f4f6f8] dark:bg-gray-900 font-sans pb-12 transition-colors duration-300">
      {/* Navbar */}
      <nav className="bg-white dark:bg-gray-800 px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-20 transition-colors duration-300">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer">
            <svg className="text-blue-600 dark:text-blue-400 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-wide transition-colors">
              Gidy
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">Jobs</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">Hackathons</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">Projects</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">Tasks</a>
            <a href="#" className="hover:text-gray-900 dark:hover:text-gray-100 transition hover:bg-gray-50 dark:hover:bg-gray-700 px-3 py-1.5 rounded-md">Organization</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-500 dark:text-gray-400 outline-none" title="Toggle Theme">
            {theme === 'light' ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            )}
          </button>
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white flex items-center justify-center font-bold shadow-md cursor-pointer hover:shadow-lg transition-transform hover:scale-105">
            S
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 mt-8 space-y-6 text-gray-800 dark:text-gray-200">

        {/* Profile Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100/80 dark:border-gray-700 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden group transition-colors duration-300">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-gradient-to-br from-blue-50 dark:from-blue-900/40 to-purple-50 dark:to-purple-900/40 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-700"></div>

          <div className="flex flex-col gap-4 relative z-10 w-full mb-2 md:mb-0">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-5">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 p-1 shadow-md">
                  <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full flex items-center justify-center overflow-hidden border-2 border-white dark:border-gray-800 transition-colors">
                    <span className="text-4xl translate-y-1">🧑</span>
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 transition-colors"></div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 dark:from-gray-100 to-gray-600 dark:to-gray-400 transition-colors">{profile.name}</h1>
                  <button onClick={() => handleEditClick('profile')} className="text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md font-semibold transition flex items-center gap-1 border border-gray-200 dark:border-gray-600">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mt-2 hover:opacity-80 transition-opacity cursor-pointer inline-flex">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  <a href={`mailto:${profile.email}`} className="text-sm font-medium">{profile.email}</a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full md:w-auto relative z-10 flex flex-col items-center md:items-end md:shrink-0 bg-gray-50/50 dark:bg-transparent rounded-xl p-4 md:p-0 border border-gray-100 dark:border-none transition-colors">
            <div className="border border-gray-100 dark:border-gray-700 shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)] dark:shadow-none rounded-xl p-4 flex items-center gap-6 bg-white dark:bg-gray-800 w-full md:w-auto justify-center transition-colors">
              <div className="w-12 h-12 flex items-center justify-center text-4xl drop-shadow-sm">🏅</div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">League</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">Bronze</span>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 transition-colors"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Rank</span>
                <span className="font-bold text-gray-800 dark:text-gray-200">14</span>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-700 transition-colors"></div>
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Points</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">400</span>
              </div>
            </div>
            <button className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 font-semibold text-sm mt-4 transition flex items-center gap-1 group/btn">
              View Rewards
              <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>

        {/* AI Bio Feature */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 relative overflow-hidden group transition-colors duration-300">
          <div className="absolute top-4 right-4 text-indigo-400 opacity-10 group-hover:opacity-50 transition-opacity duration-500 transform group-hover:rotate-12 group-hover:scale-110">
            <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6H22l-6 4.8 2.3 7.6-6.3-4.8-6.3 4.8 2.3-7.6-6-4.8h7.6L12 2z" opacity="0.3" /><path d="M5 2l1.2 3.8H10l-3 2.4 1.15 3.8L5 9.6 1.85 12 3 8.2 0 5.8h3.8L5 2z" opacity="0.6" /><path d="M19 12l1.2 3.8H24l-3 2.4 1.15 3.8L19 19.6l-3.15 2.4L17 18.2l-3-2.4h3.8L19 12z" opacity="0.4" /></svg>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 relative z-10 w-full">
            <h2 className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2 text-lg transition-colors">
              About Me
              {isGenerating && (
                <span className="flex h-2.5 w-2.5 relative ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                </span>
              )}
            </h2>
            <button
              onClick={generateBio}
              disabled={isGenerating}
              className="text-xs font-bold text-white bg-indigo-500 hover:bg-indigo-600 dark:bg-indigo-600 dark:hover:bg-indigo-700 disabled:bg-indigo-300 dark:disabled:bg-indigo-800 px-4 py-2 rounded-lg transition-all flex items-center gap-2 disabled:cursor-not-allowed shadow-sm md:w-auto w-fit"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              {aiBio === 'Career goals have not been added yet.' ? 'Auto-Generate AI Bio' : 'Regenerate Bio'}
            </button>
          </div>

          <div className="relative z-10 pt-2 min-h-[60px] flex items-center">
            <p className={`text-[15px] leading-relaxed max-w-4xl transition-colors duration-500 ${aiBio === 'Career goals have not been added yet.' ? 'text-gray-400 dark:text-gray-500 italic' : 'text-gray-700 dark:text-gray-300'}`}>
              {aiBio}
              {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse relative top-0.5"></span>}
            </p>
          </div>
        </div>

        {/* Bottom Modules */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* Left Column (Skills) */}
          <div className="md:col-span-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col h-fit transition-colors duration-300">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2 transition-colors">
                Skills Showcase
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/40 px-2 py-1 rounded-md transition-colors">{skills?.length || 0}</span>
                <button onClick={() => handleEditClick('skills')} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </div>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 font-medium transition-colors">Click to endorse a skill</p>

            <div className="flex items-start flex-wrap gap-2.5">
              {skills && skills.map((skill, idx) => (
                <button
                  key={skill.name}
                  onClick={() => toggleEndorsement(idx)}
                  className={`
                    group relative px-3 py-1.5 rounded-xl text-sm font-medium border flex items-center gap-2 cursor-pointer
                    transition-all duration-300 hover:-translate-y-0.5
                    ${skill.endorsedByMe
                      ? 'bg-blue-50/80 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-blue-50/30 dark:hover:bg-gray-700'
                    }
                  `}
                >
                  <span>{skill.name}</span>
                  <span className={`
                    min-w-[20px] h-5 px-1.5 rounded-md flex items-center justify-center text-[11px] font-bold transition-colors
                    ${skill.endorsedByMe
                      ? 'bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 group-hover:text-blue-700 dark:group-hover:text-blue-200'
                    }
                  `}>
                    {skill.endorsements}
                  </span>
                  {skill.endorsedByMe && (
                    <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 dark:bg-blue-500 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500 dark:bg-blue-400 border border-white dark:border-gray-900"></span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right Column (Experience Timeline, Education, Certification) */}
          <div className="md:col-span-8 space-y-6">

            {/* Interactive Timeline Experience */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 transition-colors duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-lg flex items-center gap-2 transition-colors">
                  Work Experience
                  <span className="text-xs font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full ml-2 transition-colors">Interactive</span>
                </h2>
                <button onClick={() => handleEditClick('experience')} className="text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </button>
              </div>

              <div className="relative border-l-2 border-gray-100 dark:border-gray-700 ml-2 md:ml-4 space-y-8 mt-4 transition-colors">
                {expTimeline && expTimeline.map((exp, index) => (
                  <div
                    key={exp.id}
                    className="relative pl-6 sm:pl-8 cursor-pointer group"
                    onMouseEnter={() => setActiveExp(exp.id)}
                  >
                    {index !== expTimeline.length - 1 && activeExp === exp.id && (
                      <div className="absolute -left-[2px] top-6 bottom-[-24px] w-[2px] bg-gradient-to-b from-blue-400 dark:from-blue-500 to-transparent"></div>
                    )}
                    <div className={`
                        absolute -left-[11px] top-1 w-5 h-5 rounded-full border-[3px] transition-all duration-300 z-10
                        ${activeExp === exp.id
                        ? 'bg-white dark:bg-gray-800 border-blue-500 shadow-[0_0_0_4px_rgba(59,130,246,0.15)] dark:shadow-[0_0_0_4px_rgba(59,130,246,0.3)] scale-110'
                        : 'bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 group-hover:border-blue-400 dark:group-hover:border-blue-500'
                      }
                      `}></div>
                    <div className={`transition-all duration-300 ${activeExp === exp.id ? 'opacity-100 translate-x-1' : 'opacity-60 hover:opacity-80'}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 mb-1">
                        <h3 className={`text-base font-bold transition-colors ${activeExp === exp.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-gray-200'}`}>
                          {exp.role}
                        </h3>
                        <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 px-2.5 py-1 rounded-md w-fit whitespace-nowrap transition-colors">
                          {exp.period}
                        </span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 text-sm font-semibold transition-colors">{exp.company}</p>
                      <div className={`
                          grid transition-all duration-500 ease-in-out origin-top
                          ${activeExp === exp.id ? 'grid-rows-[1fr] mt-3 opacity-100' : 'grid-rows-[0fr] opacity-0'}
                        `}>
                        <div className="overflow-hidden">
                          <p className="text-gray-500 dark:text-gray-400 text-[14px] leading-relaxed border-l-2 border-blue-100 dark:border-blue-900/50 pl-4 py-1 transition-colors">
                            {exp.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education and Certification side by side on Desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col group hover:border-indigo-100 dark:hover:border-indigo-900/50 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-all">🎓</div>
                  <button onClick={() => handleEditClick('education')} className="text-gray-400 dark:text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 transition-colors">Education</h2>
                {education && education.length > 0 ? (
                  <div className="space-y-4">
                    {education.map((edu, idx) => (
                      <div key={idx}>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs transition-colors">{edu.degree}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{edu.institution} • {edu.period}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 transition-colors">Add your academic background</p>
                )}
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col group hover:border-teal-100 dark:hover:border-teal-900/50 transition-colors duration-300">
                <div className="flex justify-between items-center mb-4">
                  <div className="w-10 h-10 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center text-xl group-hover:scale-110 transition-all">🔒</div>
                  <button onClick={() => handleEditClick('certifications')} className="text-gray-400 dark:text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                  </button>
                </div>
                <h2 className="font-semibold text-gray-800 dark:text-gray-200 text-sm mb-2 transition-colors">Certifications</h2>
                {certifications && certifications.length > 0 ? (
                  <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                      <div key={idx}>
                        <h4 className="font-bold text-gray-800 dark:text-gray-200 text-xs transition-colors">{cert.name}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 transition-colors">{cert.issuer} • {cert.date}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 dark:text-gray-500 text-xs mt-1 transition-colors">Showcase your verified skills</p>
                )}
              </div>
            </div>

          </div>
        </div>

      </main>

      {/* Dynamic Edit Modal */}
      {editSection && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4 transition-colors">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200 transition-colors border border-gray-100 dark:border-gray-700">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/80 transition-colors">
              <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg capitalize transition-colors">Edit {editSection}</h3>
              <button onClick={() => setEditSection(null)} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6">
              {editSection === 'profile' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Email Address</label>
                    <input
                      type="email"
                      value={editForm.email}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 transition-colors">About Me (Bio)</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 min-h-[100px]"
                    ></textarea>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">Edit data in JSON format below.</p>
                  <textarea
                    value={formText}
                    onChange={(e) => setFormText(e.target.value)}
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700/50 focus:bg-white dark:focus:bg-gray-700 min-h-[250px]"
                  ></textarea>
                </div>
              )}

              <div className="mt-8 flex justify-end gap-3">
                <button type="button" onClick={() => setEditSection(null)} className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 rounded-xl transition-colors shadow-md shadow-blue-500/20">
                  Save Changes
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
