
async function getOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      username: '',
      password: '',
      keycloakUrl: '',
      realm: '',
    }, items => {
      resolve(items);
    });
  });
}

async function getBearerToken() {
  const { username, password, keycloakUrl, realm} = await getOptions();
  const keycloakTokenUrl = `${keycloakUrl}/auth/realms/${realm}/protocol/openid-connect/token`;
  const axiosConfig = {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  };
  const params = `client_id=admin-cli&grant_type=password&password=${encodeURIComponent(password)}&username=${username}`;
  const response = await axios.post(keycloakTokenUrl, params, axiosConfig);
  return response.data.access_token;
}
