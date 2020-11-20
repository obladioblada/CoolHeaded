// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let contextArray = [];
let anyMatchRegex = "(.*)";

function escapeRegExp(string) {
    return string.replace(/[\/]/g, '\\$&'); // $& means the whole matched string
}


let background = {

    init: function () {

        chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
            if (request.fn in background) {
                background[request.fn](request, sender, sendResponse)
            }
        });

        chrome.webRequest.onBeforeSendHeaders.addListener(
            function (details) {
                if (contextArray !== null) {
                    const headerParams = contextArray.filter((context) => {
                        if(context.filter === undefined || context.filter === "") {
                            return false;
                        }
                        const anyMatchedString = context.filter.replace(/\*/g, anyMatchRegex);
                        const regex = escapeRegExp(anyMatchedString);
                        return details.url.match(regex) !== null
                    });
                    headerParams.forEach((param) => {
                        details.requestHeaders.push({name: param.name, value: param.value});
                    })
                }
                return {requestHeaders: details.requestHeaders};
            },
            {urls: ["<all_urls>"]},
            ["blocking", "requestHeaders"]
        );

        chrome.storage.sync.get(['coolheaded_context_array'], function (result) {
            console.log(result.coolheaded_context_array)
            if (result.coolheaded_context_array !== undefined) {
                contextArray = result.coolheaded_context_array;
            }
        });
    },

    setContextArray(request, sender, sendResponse) {
        contextArray = request.value;
        return true;
    },
}
background.init()
