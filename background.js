// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let contextArray = [];

let background = {

    init: function () {

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.fn in background) {
                background[request.fn](request, sender, sendResponse)
            }
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                console.log("checking filters")
                if(contextArray !== null) {
                    console.log("filtering")
                    const headerParams = contextArray.filter((context) => details.url.includes(context.filter));
                    console.log(headerParams);
                    headerParams.forEach((param) => {
                        console.log(param)
                        console.log("Matched url: adding param");
                        console.log({name: param.name, value: param.value});
                        details.requestHeaders.push({name: param.name, value: param.value});
                    })
                }
                return {requestHeaders: details.requestHeaders};
            },
            {urls: ["<all_urls>"]},
            ["blocking", "requestHeaders"]
        );

        chrome.runtime.onConnect.addListener(function (externalPort) {
            externalPort.onDisconnect.addListener(function () {
                console.log(contextArray);
                console.log("onDisconnect")
            })
            console.log("onConnect")
        })
    },

    setContextArray(request, sender, sendResponse) {
        console.log(request.value);
        console.log(Array.isArray(request.value));
        contextArray = request.value;
        console.log(contextArray);
        sendResponse({status: "ok"});
        return true;
    },

    getContextArray(request, sender, sendResponse) {
        console.log("passing context array")
        console.log(contextArray);
        sendResponse(contextArray);
        return true;
    },

    clearContextArray(request, sender, sendResponse) {
        console.log("clearing array");
        contextArray = [];
        sendResponse({status: "ok", value: contextArray });
        return true;
    }
}

background.init()
