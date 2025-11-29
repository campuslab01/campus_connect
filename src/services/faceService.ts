import api from '../config/axios';

export const faceService = {
  async uploadSelfie(file: File, profileImageUrl?: string) {
    const form = new FormData();
    form.append('selfie', file);
    if (profileImageUrl) {
      form.append('profileImageUrl', profileImageUrl);
    }
    const res = await api.post('/face/verify-user', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  async detect(file: File) {
    const form = new FormData();
    form.append('image', file);
    const res = await api.post('/face/detect', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  async compare(selfie: File, profileImageUrl?: string) {
    const form = new FormData();
    form.append('selfie', selfie);
    if (profileImageUrl) form.append('profileImageUrl', profileImageUrl);
    const res = await api.post('/face/compare', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },
  async getVerificationStatus() {
    const res = await api.get('/face/status');
    return res.data;
  }
};

export default faceService;