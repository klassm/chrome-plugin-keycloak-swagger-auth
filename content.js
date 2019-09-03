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

async function sendKeycloakRequest() {
  chrome.runtime.sendMessage(
      {contentScriptQuery: "getBearerToken"},
      token => {
        const input = findAuthContainer().getElementsByTagName("input")[0];

        const event = new Event('input', { bubbles: true });
        input.value = token;
        input.dispatchEvent(event);
      }
  );
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
