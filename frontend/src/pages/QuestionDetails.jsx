import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionCard from '../components/QuestionCard';
import AnswerCard from '../components/AnswerCard';

const QuestionDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [question, setQuestion] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [newAnswer, setNewAnswer] = useState('');
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiGenerated, setAiGenerated] = useState(false); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [qRes, aRes] = await Promise.all([
          api.get(`/questions/${id}`),
          api.get(`/answers/${id}`)
        ]);
        
        setQuestion(qRes?.data || null);

        const rawAnswers = Array.isArray(aRes?.data) ? aRes.data : [];
        setAnswers(rawAnswers.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)));
        
        if (rawAnswers.some(a => a.author === "✨ AI Assistant")) {
            setAiGenerated(true);
        }
      } catch (err) {
        setError('Failed to locate this discussion.');
        setQuestion(null);
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleUpvote = async (questionId) => {
    let userStr = localStorage.getItem('currentUser');
    if (!userStr || userStr === "undefined") return alert('Sign in to upvote.');
    
    if (question) setQuestion(prev => ({ ...prev, upvotes: (prev.upvotes || 0) + 1 }));

    try { await api.patch(`/questions/${questionId}/upvote`); } 
    catch { if (question) setQuestion(prev => ({ ...prev, upvotes: Math.max((prev.upvotes || 0) - 1, 0) })); }
  };

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return setError('Please type an answer before submitting.');

    let user;
    try {
      const str = localStorage.getItem('currentUser');
      if (!str || str === "undefined") throw new Error();
      user = JSON.parse(str);
    } catch (err) {
      return setError('You must be logged in to post an answer.');
    }
    
    setError('');
    setSubmitLoading(true);

    try {
      const { data } = await api.post('/answers', {
        questionId: id,
        text: newAnswer.trim(),
        author: user.name || "Anonymous"
      });
      setAnswers(prev => Array.isArray(prev) ? [data, ...prev] : [data]);
      setNewAnswer('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post answer');
    } finally {
      setSubmitLoading(false);
    }
  };


  const handleGenerateAI = async () => {
    if (aiGenerated) return; 
    let userStr = localStorage.getItem('currentUser');
    if (!userStr || userStr === "undefined") return setError("Sign in to use AI Insights.");
    
    setAiLoading(true);
    setError('');
    
    try {
        // 1. EXTRACT QUESTION IDENTITY FOR AI CONTEXT
        const prompt = `Question Title: ${question?.title}\nQuestion Body: ${question?.body}\n\nPlease provide a helpful, expert answer to this question.`;
        
        // 2. DISPATCH TO REAL AI HUB
        const { data: aiData } = await api.post('/ai/chat', { message: prompt });
        
        // 3. COMMIT AI ANSWER TO DATABASE
        const { data: ansData } = await api.post('/answers', {
            questionId: id,
            text: aiData.reply || "Connection fragmented. AI neural handshake failed.",
            author: "✨ AI Assistant"
        });

        setAnswers(prev => Array.isArray(prev) ? [ansData, ...prev] : [ansData]);
        setAiGenerated(true);
    } catch (err) {
        setError("Nexus AI core failed to generate an answer. Ensure Gemini API key is active.");
    } finally {
        setAiLoading(false);
    }
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading network...</div>;
  if (!question && !loading) return <div className="empty-state">Discussion not found</div>;

  const safeAnswers = Array.isArray(answers) ? answers : [];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{ background:'none', border:'none', cursor:'pointer', color:'var(--text-muted)', fontWeight:'600', marginBottom:'1.5rem', display:'flex', alignItems:'center', gap:'0.4rem' }}
      >
        ← Back to routing
      </button>

      {error && <div className="alert-error">{error}</div>}

      <QuestionCard question={question} onUpvote={handleUpvote} />

      <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-line)' }}>
        <button 
            className="btn" 
            onClick={handleGenerateAI}
            disabled={aiLoading || aiGenerated}
            style={{ 
                background: aiGenerated ? 'var(--border-line)' : 'var(--accent-blue)', 
                color: aiGenerated ? 'var(--text-muted)' : '#fff', 
                border: 'none', padding: '0.6rem 1.2rem', borderRadius: '8px', 
                fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem', 
                transition: 'all 0.2s', cursor: (aiLoading || aiGenerated) ? 'not-allowed' : 'pointer' 
            }}
        >
            {aiLoading ? '🧠 Inferring context...' : (aiGenerated ? '✨ AI Processed' : '✨ Generate AI Answer')}
        </button>
      </div>

      <div className="answer-list" style={{ marginTop: '1.5rem' }}>
        <h3 style={{ marginBottom:'1.5rem', fontSize: '1.1rem' }}>
          {safeAnswers.length} {safeAnswers.length === 1 ? 'Response' : 'Responses'}
        </h3>
        {safeAnswers.map(ans => <AnswerCard key={ans.id} answer={ans || {}} />)}
      </div>

      <div className="card" style={{ marginTop: '2rem', padding: '1.5rem' }}>
        <h4 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Add Your Expertise</h4>
        <form onSubmit={handlePostAnswer}>
          <div className="form-group">
            <textarea 
              className="form-control" 
              placeholder="Provide a human answer..."
              value={newAnswer}
              onChange={e => setNewAnswer(e.target.value)}
              style={{ minHeight: '100px', background: 'var(--bg-panel)' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={submitLoading || !newAnswer.trim()}>
            {submitLoading ? 'Transmitting...' : 'Post Answer'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuestionDetails;
