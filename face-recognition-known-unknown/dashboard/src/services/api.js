const API_BASE = 'http://localhost:8080';

export const api = {
  async getStats() {
    const response = await fetch(`${API_BASE}/api/stats`);
    return response.json();
  },

  async getVisitors() {
    const response = await fetch(`${API_BASE}/api/visitors`);
    return response.json();
  },

  async uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch(`${API_BASE}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  },

  getImageUrl(path) {
    return `${API_BASE}/uploads/${path}`;
  },
};