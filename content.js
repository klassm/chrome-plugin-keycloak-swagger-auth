function findAuthContainer() {
  const authContainers = Array.from(document.getElementsByClassName('auth-container'));
  if (!authContainers || authContainers.length === 0) {
    return undefined;
  }

  return authContainers.find(wrapper => {
    return Array.from(wrapper.getElementsByTagName("code"))
      .find(el => el.innerText.includes("bearerAuth"));
  })
}

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

async function sendKeycloakRequest() {
  const token = await getBearerToken();
  const input = findAuthContainer().getElementsByTagName("input")[0];

  const event = new Event('input', { bubbles: true });
  input.value = token;
  input.dispatchEvent(event);
}

async function nodeInsertedCallback(event) {
  if (!event.target || !event.target.getAttribute) return;

  const classes = event.target.getAttribute('class');
  if (!classes || !classes.includes('dialog-ux')) {
    return;
  }
  const container = findAuthContainer();
  if (!container) {
    return;
  }
  const wrapper = container.getElementsByClassName('auth-btn-wrapper')[0];
  const button = document.createElement('button');
  button.innerText = 'Fetch Keycloak Token';
  button.setAttribute('class', 'btn modal-btn');
  button.addEventListener('click', sendKeycloakRequest);
  wrapper.appendChild(button);
}

function init() {
  if (document.getElementById("swagger-ui")) {
    document.addEventListener('DOMNodeInserted', nodeInsertedCallback);
  }
}

init();
