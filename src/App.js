import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/chat', { message });
      setResponse(res.data.response);
    } catch (error) {
      setResponse('Lỗi: ' + error.message);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Chat với Gemma-2-9B</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Nhập câu hỏi..."
          style={{ width: '70%', padding: '10px' }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? 'Đang xử lý...' : 'Gửi'}
        </button>
      </form>
      {response && (
        <div style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}>
          <strong>Trả lời:</strong> {response}
        </div>
      )}
    </div>
  );
}

export default App;
