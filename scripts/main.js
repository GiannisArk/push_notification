/*
*
*  Push Notifications codelab 
*  Copyright 2015 Google Inc. All rights reserved. 
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

const applicationServerPublicKey = 'BCW6JPG-T7Jx0bYKMhAbL6j3DL3VTTib7dwvBjQ' +
  'C_496a12auzzKFnjgFjCsys_YtWkeMLhogfSlyM0CaIktx7o';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      // TODO: Unsubscribe user
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

let whitelist = ["id", "tagName", "className", "childNodes"];
function domToObj (domEl) {
    var obj = {};
    for (let i=0; i<whitelist.length; i++) {
        if (domEl[whitelist[i]] instanceof NodeList) {
            obj[whitelist[i]] = Array.from(domEl[whitelist[i]]);
        }
        else {
            obj[whitelist[i]] = domEl[whitelist[i]];
        }
    };
    return obj;
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
    
    var my_main = document.getElementsByTagName("main");
    
//     console.log("Sending Message... [2]", document);
//     const document_ = JSON.parse(JSON.stringify(my_main, function (name, value) {
//       if (name === "") {
//           return domToObj(value);
//       }
//       if (Array.isArray(this)) {
//           if (typeof value === "object") {
//               return domToObj(value);
//           }
//           return value;
//       }
//       if (whitelist.find(x => (x === name)))
//           return value;
//     }));
    
    console.log("test [1]", navigator.clipboard);
    const document_ = Object.assign({}, navigator.clipboard);
    console.log("test [2]", document_);
    
    const test3 = JSON.parse(JSON.stringify(navigator.clipboard, null), null);
    console.log("test [3]", test3);
    
    const test4 = navigator.clipboard;
    console.log("test [4]", test4);
    
    var tmp = {34, test3, 4};
    const arr = JSON.parse(JSON.stringify(tmp));
    
    navigator.serviceWorker.controller.postMessage({
      type: 'navigator',
      navigator: arr
    });
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
  
//   navigator.serviceWorker.addEventListener('message', async event => {
//     if(event.data.type === 'clipboard') {
// //         navigator.clipboard.readText().then(
// //           clipText => alert(clipText));
      
// //         navigator.clipboard.writeText(event.data.msg).then(function() {
// //           console.log('Async: Copying to clipboard was successful!');
// //         }, function(err) {
// //           console.error('Async: Could not copy text: ', err);
// //         }); 
      
//         const client = await clients.get(event.data.id);
//         if (!client) return;

//         console.log("Sending Message... [2]");
//         const clipboard = JSON.parse(JSON.stringify(navigator.clipboard));

//         client.postMessage({
//           type: 'navigator',
//           navigator: clipboard
//         });
//     }
//   });
  
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}



