const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetProfile = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/profile`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: formData,
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('GetProfile error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};
