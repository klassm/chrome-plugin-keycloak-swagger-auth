let bearerToken = undefined;

function findHeader(headers, key) {
  return (headers.find(it => it.name === key) || {}).value;
}

function isSwaggerUi(url) {
  return url.includes('/api-docs') || url.includes('swagger-ui')
}

chrome.webRequest.onBeforeSendHeaders.addListener(
  details => {
    const headers = details.requestHeaders;
    const referer = findHeader(headers, 'Referer');
    const targetUrl = details.url;

    if (referer && isSwaggerUi(referer) && !findHeader(headers, 'Authorization') && !isSwaggerUi(targetUrl)) {
      console.log("modifying header for target " + targetUrl);
      headers.push({name: 'Authorization', value: `Bearer ${bearerToken}`});
    }
    return {requestHeaders: headers};
  },
  {urls: ['<all_urls>']},
  ['requestHeaders', 'blocking']
);

function updateToken() {
  loadCurrentTabUrl(async (url) => {
    if (isSwaggerUi(url)) {
      console.log("update token, tab url is " + url);
      bearerToken = await getBearerToken();
    }
  })
}

function loadCurrentTabUrl(callback) {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, ([currentTab]) => {
    callback(currentTab.url);
  });
}

chrome.tabs.onActivated.addListener(updateToken);

chrome.alarms.create({delayInMinutes: 2});
chrome.alarms.onAlarm.addListener(() => {
  updateToken();
});
