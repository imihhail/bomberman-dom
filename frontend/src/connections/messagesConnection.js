const backendUrl =
  import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8080';

export const GetMessages = async (partnerId) => {
  try {
    const response = await fetch(`${backendUrl}/messages`, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      referrerPolicy: 'no-referrer',
      redirect: 'follow',
      body: partnerId,
      credentials: 'include',
    });
    const resp = await response.json();
    return resp;
  } catch (error) {
    console.log('GetMessages error');
    console.log(error);
    return { server: 'fail', error: 'Error 500, Internal server error!' };
  }
};
