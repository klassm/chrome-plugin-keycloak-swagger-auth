function onFormSubmit() {
  const keycloakUrl = document.getElementById('keycloakUrl').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  chrome.storage.sync.set({
    keycloakUrl,
    username,
    password
  });
}

function loadValues() {
  chrome.storage.sync.get({
    username: '',
    password: '',
    keycloakUrl: ''
  }, items => {
    const keycloakUrl = document.getElementById('keycloakUrl');
    const username = document.getElementById('username');
    const password = document.getElementById('password');

    keycloakUrl.value = items.keycloakUrl;
    username.value = items.username;
    password.value = items.password;
  });
}

document.getElementById('submitForm').addEventListener('click', onFormSubmit);
loadValues();
