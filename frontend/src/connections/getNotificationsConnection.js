const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetNotifications = async (formData) => {
  try {
    const response = await fetch(`${backendUrl}/notifications`, {
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
    console.log('GetNotifications error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};