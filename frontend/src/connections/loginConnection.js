const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetLogin = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/login`, {
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
    console.log('GetLogin error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};
