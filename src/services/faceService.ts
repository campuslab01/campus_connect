import api from '../config/axios';

const faceService = {
  async verifySelfie(selfie: File, profileImageUrl?: string, profileFile?: File) {
    const form = new FormData();
    form.append('selfie', selfie);
    if (profileImageUrl) form.append('profileImageUrl', profileImageUrl);
    if (profileFile) form.append('profile', profileFile);
    const res = await api.post('/verify-face/verify', form, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};

export default faceService;