function onFormSubmit() {
  const keycloakUrl = document.getElementById('keycloakUrl').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const realm = document.getElementById('realm').value;

  chrome.storage.sync.set({
    keycloakUrl,
    username,
    password,
    realm
  });
}

function loadValues() {
  chrome.storage.sync.get({
    username: '',
    password: '',
    keycloakUrl: '',
    realm: ''
  }, items => {
    const keycloakUrl = document.getElementById('keycloakUrl');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const realm = document.getElementById('realm');

    keycloakUrl.value = items.keycloakUrl;
    username.value = items.username;
    password.value = items.password;
    realm.value = items.realm;
  });
}

document.getElementById('submitForm').addEventListener('click', onFormSubmit);
loadValues();
