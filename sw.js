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


/* eslint-env browser, serviceworker, es6 */

'use strict';


var client_;

const applicationServerPublicKey = 'BDaPgDbEeIKuO7kfW1Sez1Iv_MWb37VZLuW6A94ZpuvV33Bf4WDa86B_NehxcuoYi4jiNtwK5ruptBV8DukRt0o';


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

self.addEventListener('push', async function(event) {
  console.log('[Service Worker] Push Received.');
  console.log(`[Service Worker] Push had this data: "${event.data.text()}"`);
  
  const title = 'Giannis';
  const options = {
    action: 'archive',
    body: 'testme',
    icon: 'images/icon.png',
    badge: 'images/badge.png',
    vibrate: [200, 100, 200, 100, 200, 100, 200],
    tag: 'vibration-sample'
  };
  
  console.log("[push]", client_);
  
  client_.postMessage({
      type: 'clipboard',
      msg: 'event'
    });
  
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', async function(event){
    event.notification.close();
    console.log("[notificationclick] triggered");

    console.log("-->", event.clientId);
    if (!event.clientId) return;
    const client = await clients.get(event.clientId);
    if (!client) return;

    console.log("Sending Message...");
    event = JSON.parse(JSON.stringify(event));
    client.postMessage({
      type: 'clipboard',
      msg: event
    });
  
});

self.addEventListener('fetch', async function(event) {
  console.log("[fetch] event.clientId:", event.clientId);
    
  if (!event.clientId) return;
  const client = await clients.get(event.clientId);
  if (!client) return;
  
  client_ = client;
  
  console.log("[fetch]",client);

  console.log("Sending Message...");
  event = JSON.parse(JSON.stringify(event));
  client.postMessage({
    type: 'clipboard',
    msg: event,
  }); 
  
});

// self.addEventListener('message', function (evt) {
//   if(evt.data.type == 'navigator'){
//     console.log("[message] ->", evt.data.navigator);
//   }
  
//   if(evt.data.type == 'clipboard'){
//     console.log("[message] ->", evt.data.msg);
//   }
// });

self.addEventListener('activate', event => {
  cosole.log('[activate]'); 
  event.waitUntil(clients.claim());
});

var CACHE_VERSION = 1;
var CURRENT_CACHES = {
  prefetch: 'prefetch-cache-v' + CACHE_VERSION
};

self.addEventListener('install', function(event) {
  var urlsToPrefetch = [
    './main/icon.png'
  ];

  console.log('Handling install event. Resources to pre-fetch:', urlsToPrefetch);

  event.waitUntil(
    caches.open(CURRENT_CACHES['prefetch']).then(function(cache) {
      return cache.addAll(urlsToPrefetch.map(function(urlToPrefetch) {
        return new Request(urlToPrefetch, {mode: 'no-cors'});
      })).then(function() {
        console.log('All resources have been fetched and cached.');
      });
    }).catch(function(error) {
      console.error('Pre-fetching failed:', error);
    })
  );
});

self.addEventListener('pushsubscriptionchange', function(event) {
  console.log('[Service Worker]: \'pushsubscriptionchange\' event fired.');
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  event.waitUntil(
    self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey
    })
    .then(function(newSubscription) {
      // TODO: Send to application server
      console.log('[Service Worker] New subscription: ', newSubscription);
    })
  );
});

