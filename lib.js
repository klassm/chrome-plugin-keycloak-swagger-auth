async function getAllOptions() {
  return new Promise((resolve) => {
    chrome.storage.sync.get({
      data: []
    }, items => {
      resolve(items.data || []);
    });
  });
}

async function optionsForUrl(url) {
  const options = await getAllOptions();
  return options.find(option => url.match(option.urlRegexp))
}

async function deleteOptionFor(urlRegexp) {
  const allOptions = await getAllOptions();
  const withoutExisting = allOptions.filter(option => urlRegexp !== option.urlRegexp);

  chrome.storage.sync.set({
    data: withoutExisting
  });
}

async function saveOption(keycloakUrl, username, password, realm, urlRegexp) {
  const allOptions = await getAllOptions();
  const withoutExisting = allOptions.filter(option => urlRegexp !== option.urlRegexp);
  withoutExisting.push({
    keycloakUrl,
    username,
    password,
    realm,
    urlRegexp
  });

  chrome.storage.sync.set({
    data: withoutExisting
  });
}

async function getBearerToken(url) {
  const options = await optionsForUrl(url);
  if (!options) {
    return null;
  }
  const { username, password, keycloakUrl, realm} = options;
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
