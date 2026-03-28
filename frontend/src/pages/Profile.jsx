import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  const [currentUser, setCurrentUser] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
        const str = localStorage.getItem('currentUser');
        if (str && str !== "undefined") setCurrentUser(JSON.parse(str));
    } catch { }

    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/profile/${username}`);
        setProfile(data);
        setEditBio(data.bio || '');
        setImagePreview(data.profileImage || '');

        const postsData = await api.get(`/posts/profile/${username}`);
        setPosts(Array.isArray(postsData.data?.posts) ? postsData.data.posts : []);
      } catch (err) {
        console.error("Profile payload crash avoided.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [username]);

  const handleFollow = async () => {
      if (!currentUser) return alert('Initialize Identity module first.');
      const safeFollowers = Array.isArray(profile.followers) ? profile.followers : [];
      const isFollowing = safeFollowers.includes(currentUser.name);
      
      setProfile(prev => ({
          ...prev, 
          followers: isFollowing ? safeFollowers.filter(x => x !== currentUser.name) : [...safeFollowers, currentUser.name]
      }));
      
      try { await api.patch('/users/follow', { currentUsername: currentUser.name, targetUsername: profile.name }); } catch { }
  }

  const handleFileSelection = (e) => {
      const file = e.target.files[0];
      if (file) {
          if (!file.type.startsWith('image/')) return alert('Please exclusively select image binaries.');
          setProfileImageFile(file);
          setImagePreview(URL.createObjectURL(file));
      }
  }

  const saveProfile = async () => {
      setSaving(true);
      try {
          let updatedImageUrl = profile.profileImage;
          if (profileImageFile) {
              const formData = new FormData();
              formData.append('file', profileImageFile);
              
              const uploadRes = await api.post('/upload/profile', formData, {
                  headers: { 'Content-Type': 'multipart/form-data' }
              });
              updatedImageUrl = `http://localhost:5000${uploadRes.data.url}`;
          }

          const { data } = await api.patch('/users/profile', { name: profile.name, bio: editBio, profileImage: updatedImageUrl });
          setProfile(data);
          
          if (currentUser?.name === data.name) {
              localStorage.setItem('currentUser', JSON.stringify({...currentUser, profileImage: data.profileImage}));
          }
          setIsEditing(false);
      } catch { alert('Transmission failed.'); } 
      finally { setSaving(false); }
  }

  if (loading) return <div className="empty-state">Establishing connection to Neural Grid...</div>;
  if (!profile) return <div className="empty-state">Identity matrix explicitly unresolved.</div>;

  const isOwner = currentUser?.name === profile.name;
  const safeFollowers = Array.isArray(profile.followers) ? profile.followers : [];
  const safeFollowing = Array.isArray(profile.following) ? profile.following : [];
  const amIFollowing = currentUser ? safeFollowers.includes(currentUser.name) : false;

  const fallbackAvatar = `https://ui-avatars.com/api/?name=${profile.name}&background=111&color=fff&size=200`;
  const displayImage = isEditing ? (imagePreview || fallbackAvatar) : (profile.profileImage || fallbackAvatar);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      {/* Absolute Full-Screen Cover Matrix */}
      <div style={{ width: '100%', height: '300px', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, rgba(139,92,246,0.2) 100%)', position: 'relative', borderBottom: '1px solid var(--glass-border)' }}>
          <button onClick={() => navigate('/')} style={{ position: 'absolute', top: '24px', left: '24px', background: 'var(--glass-bg)', backdropFilter: 'blur(10px)', border: '1px solid var(--glass-border)', color: '#fff', padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              ← Return Home
          </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 24px' }}>
          
        {/* Profile Identity Card */}
        <div className="card" style={{ marginTop: '-80px', position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '40px 24px' }}>
            <div style={{ width: '160px', height: '160px', borderRadius: '50%', overflow: 'hidden', border: '4px solid var(--bg-card)', marginBottom: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', background: '#000' }}>
                <img src={displayImage} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = fallbackAvatar; }} />
            </div>
            
            {isEditing && (
                <label className="btn" style={{ marginBottom: '16px', cursor: 'pointer', padding: '6px 16px', fontSize: '13px' }}>
                    Upload Local Avatar
                    <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileSelection} />
                </label>
            )}

            <h1 style={{ fontSize: '28px', fontWeight: '700', fontFamily: 'Poppins', marginBottom: '8px' }}>{profile.name}</h1>
            <div style={{ fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--accent-blue)', marginBottom: '16px' }}>
                {profile.role === 'creator' ? 'Nexus Creator' : 'Standard Node'}
            </div>

            <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', fontSize: '15px' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontWeight: '800', fontSize: '20px' }}>{posts.length}</span> <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Broadcasts</span></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontWeight: '800', fontSize: '20px' }}>{safeFollowers.length}</span> <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Connections</span></div>
                <div style={{ display: 'flex', flexDirection: 'column' }}><span style={{ fontWeight: '800', fontSize: '20px' }}>{safeFollowing.length}</span> <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>Following</span></div>
            </div>

            {isEditing ? (
                <div style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <textarea className="form-control" placeholder="Update bio..." value={editBio} onChange={e=>setEditBio(e.target.value)} style={{ minHeight: '100px', resize: 'vertical' }} />
                    <button className="btn btn-primary" onClick={saveProfile} disabled={saving}>{saving ? 'Transmitting Data...' : 'Save Configuration'}</button>
                    <button className="btn" onClick={() => setIsEditing(false)}>Cancel Processing</button>
                </div>
            ) : (
                <div style={{ width: '100%', maxWidth: '500px', marginBottom: '24px' }}>
                    <div style={{ fontSize: '15px', lineHeight: '1.6', color: '#e5e7eb', whiteSpace: 'pre-line' }}>{profile.bio || "No biography provided in matrix."}</div>
                    <div style={{ marginTop: '24px' }}>
                        {isOwner ? (
                            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>Reconfigure Profile</button>
                        ) : (
                            <button className="btn btn-primary" onClick={handleFollow} style={{ background: amIFollowing ? 'var(--glass-bg)' : 'var(--accent-blue)', color: '#fff', border: amIFollowing ? '1px solid var(--glass-border)' : 'none', width: '150px' }}>
                                {amIFollowing ? 'Connected' : 'Connect'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>

        {/* Global Explicit Grid View */}
        <div style={{ marginTop: '48px', paddingBottom: '64px' }}>
            <h3 className="brand-font" style={{ fontSize: '18px', textAlign: 'center', marginBottom: '32px', letterSpacing: '1px' }}>BROADCAST ARCHIVES</h3>
            {posts.length === 0 ? (
                <div className="empty-state" style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '16px' }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>📷</div>
                    <h3 style={{ fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>No Archives Found</h3>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
                    {posts.map(p => (
                        <div key={p.id} className="card" style={{ padding: 0, overflow: 'hidden', cursor: 'pointer', marginBottom: 0 }}>
                             {p.mediaUrl ? (
                                p.mediaUrl.match(/\.(mp4|webm)$/i) ? 
                                  <video src={p.mediaUrl} style={{ width:'100%', height:'300px', objectFit:'cover', display:'block' }} /> :
                                  <img src={p.mediaUrl} style={{ width:'100%', height:'300px', objectFit:'cover', display:'block' }} alt="Post" />
                             ) : (
                                <div style={{ width:'100%', height:'300px', background: 'var(--glass-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                                    <p style={{ fontSize: '18px', fontWeight: 'bold', textAlign: 'center', fontFamily: 'Poppins' }}>{p.content || p.title}</p>
                                </div>
                             )}
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
