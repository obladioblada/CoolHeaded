// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.;

'use strict';
let row = 0;

const tag = {
    LABEL: 'label-',
    INPUT: 'input-',
    BUTTON: 'button-'
}

const tagType = {
    NAME: 'name-',
    VALUE: 'value-',
    FILTER: 'filter-',
    DELETE: 'delete-'
}

let contextArray = [];


function newContext() {
    let ul = document.getElementById("context_list");
    let li = document.createElement("li");
    createRow(li, row.toString())
    ul.appendChild(li);
    row++;
}


function createRow(li, row) {
    console.log("row: " + row);
    let keyInput = document.createElement("input");
    keyInput.id = tagType.NAME + tag.INPUT + row;
    keyInput.placeholder = "key"

    let nameInput = document.createElement("input");
    nameInput.id = tagType.VALUE + tag.INPUT + row;
    nameInput.placeholder = "name"

    let filterInput = document.createElement("input");
    filterInput.id = tagType.FILTER + tag.INPUT + row;
    filterInput.placeholder = "filter"

    li.id = row;
    li.appendChild(keyInput);
    li.appendChild(nameInput);
    li.appendChild(filterInput);
    chrome.runtime.sendMessage("new row");
}


document.addEventListener('DOMContentLoaded', function () {
        row = 0
        contextArray = [];
        document.getElementById('new_context').addEventListener('click', newContext);
        document.getElementById('save').addEventListener('click', saveContextArray);
        document.getElementById('clear').addEventListener('click', clear);
        chrome.runtime.sendMessage({fn: "getContextArray"}, function (contextArray) {
            console.log(Array.isArray(contextArray));
            console.log(contextArray);
            if (contextArray !== null &&  contextArray.length > 0) row = contextArray.length - 1;
            fillRows(contextArray)
        });
    }
);


function clear() {
    chrome.runtime.sendMessage({fn: "clearContextArray"}, function (response) {
        if (response.status === "ok") {
            contextArray = [];
            console.log(contextArray);
            let ul = document.getElementById("context_list");
            ul.innerHTML = '';
            row = 0;
        }
    });
}

function fillRows(contextArray) {
    let nameInput;
    let valueInput;
    let filterInput;
    console.log(contextArray.length);
    console.log(contextArray);
    let ul = document.getElementById("context_list");
    for (let i = 0; i < contextArray.length; i++) {
        let li = document.createElement("li");
        createRow(li, i);
        ul.appendChild(li);
        console.log(row)
        console.log(i);
        [nameInput, valueInput, filterInput] = getContextInputs(i);
         nameInput.value = contextArray[i].name;
         valueInput.value = contextArray[i].value;
         filterInput.value = contextArray[i].filter;
    }
}


function saveContextArray() {
    let contextArrayToSave = []
    let nameInput;
    let valueInput;
    let filterInput;
    const ul = document.getElementById("context_list");
    const items = ul.getElementsByTagName("li");
    console.log(items.length)
    for (let i = 0; i < items.length; i++) {
        [nameInput, valueInput, filterInput] = getContextInputs(i)
        console.log(nameInput);
        contextArrayToSave.push({
            name: nameInput.value,
            value: valueInput.value,
            filter: filterInput.value
        });
    }
    chrome.runtime.sendMessage({fn: "setContextArray", value: contextArrayToSave});
}


function getContextInputs(i) {
    const nameInput = document.getElementById(tagType.NAME + tag.INPUT + i);
    const valueInput = document.getElementById(tagType.VALUE + tag.INPUT + i);
    const filterInput = document.getElementById(tagType.FILTER + tag.INPUT + i);
    console.log(nameInput);
    console.log(valueInput);
    console.log(filterInput);
    return [nameInput, valueInput, filterInput] ;
}

