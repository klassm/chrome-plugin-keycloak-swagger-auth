async function submit() {
  const keycloakUrl = document.getElementById('keycloakUrl').value;
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const realm = document.getElementById('realm').value;
  const urlRegexp = document.getElementById('urlRegexp').value;

  await saveOption(keycloakUrl, username, password, realm, urlRegexp);
  clear();
  await loadTable();
}

function fillFormWith(keycloakUrl, username, password, realm, urlRegexp) {
  const keycloakUrlInput = document.getElementById('keycloakUrl');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const realmInput = document.getElementById('realm');
  const urlRegexpInput = document.getElementById('urlRegexp');

  keycloakUrlInput.value = keycloakUrl;
  usernameInput.value = username;
  passwordInput.value = password;
  realmInput.value = realm;
  urlRegexpInput.value = urlRegexp;
}

async function loadValues(url) {
  const option = await optionsForUrl(url);
  await  fillFormWith(option.keycloakUrl, option.username, option.password, option.realm, option.urlRegexp);
}

async function deleteValue(url) {
  if (confirm(`Do you really want to delete '${url}'`)) {
    await deleteOptionFor(url);
    await loadTable();
    clear();
  }
}

function clear() {
  fillFormWith("", "", "", "", "");
}

function createIcon(faIcon, callback) {
  const icon = document.createElement("i");
  icon.className = `fas ${faIcon}`;
  icon.addEventListener("click", callback);
  return icon;
}

async function loadTable() {
  const list = document.getElementById("list");

  const tbody = list.getElementsByTagName("tbody")[0];
  const existingRows = [...tbody.getElementsByTagName("tr")];
  existingRows.forEach(row => tbody.removeChild(row));

  const options = await getAllOptions();
  list.style.display = options.length > 0 ? "block" : "none";

  options.forEach(option => {
    const row = document.createElement("tr");

    const regexpCell = document.createElement("td");
    regexpCell.appendChild(document.createTextNode(option.urlRegexp));
    row.appendChild(regexpCell);

    const buttonsCell = document.createElement("td");
    buttonsCell.appendChild(createIcon("fa-edit", async () => {
      await loadValues(option.urlRegexp)
    }));
    buttonsCell.appendChild(createIcon("fa-trash", async () => {
      await deleteValue(option.urlRegexp)
    }));
    row.appendChild(buttonsCell);
    tbody.appendChild(row);
  });
}

document.getElementById('submitForm').addEventListener('click', submit);
document.getElementById('clearForm').addEventListener('click', clear);
loadTable();
