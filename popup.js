// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.;

/**
 * Temporary workaround for secondary monitors on MacOS where redraws don't happen
 * @See https://bugs.chromium.org/p/chromium/issues/detail?id=971701
 */
if (
    // From testing the following conditions seem to indicate that the popup was opened on a secondary monitor
    window.screenLeft < 0 ||
    window.screenTop < 0 ||
    window.screenLeft > window.screen.width ||
    window.screenTop > window.screen.height
) {
    chrome.runtime.getPlatformInfo(function (info) {
        if (info.os === 'mac') {
            const fontFaceSheet = new CSSStyleSheet()
            fontFaceSheet.insertRule(`
        @keyframes redraw {
          0% {
            opacity: 1;
          }
          100% {
            opacity: .99;
          }
        }
      `)
            fontFaceSheet.insertRule(`
        html {
          animation: redraw 1s linear infinite;
        }
      `)
            document.adoptedStyleSheets = [
                ...document.adoptedStyleSheets,
                fontFaceSheet,
            ]
        }
    })
}

'use strict';

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
let buttonsDiv;



document.addEventListener('DOMContentLoaded', function () {
        contextArray = [];
        document.getElementById('new_context').addEventListener('click', newContext);
        document.getElementById('clear').addEventListener('click', clear);
        buttonsDiv = document.getElementById('buttons');
        chrome.storage.sync.get(['coolheaded_context_array'], function (result) {
            console.log(result);
            console.log(result.coolheaded_context_array)
            contextArray = result.coolheaded_context_array;
            fillRows(contextArray)
            if (contextArray.length === 0) {
                buttonsDiv.style.display = 'none';
            }
        });
    }
);


function newContext() {
    let ul = document.getElementById("context_list");
    let li = document.createElement("li");
    console.log("new context: id -> " + contextArray.length);
    createRow(li, contextArray.length)
    ul.appendChild(li);
    contextArray.push({})
    buttonsDiv.style.display = 'inherit';
    saveContextArray();
}


function createRow(li, row) {

    let nameInput = document.createElement("input");
    nameInput.id = tagType.NAME + tag.INPUT + row;
    nameInput.placeholder = "name"
    nameInput.className = "input-name";
    nameInput.type = "text";
    nameInput.onkeyup = saveContextArray;

    let valueInput = document.createElement("input");
    valueInput.id = tagType.VALUE + tag.INPUT + row;
    valueInput.placeholder = "value"
    valueInput.className = "input-value";
    valueInput.type = "text";
    valueInput.onkeyup = saveContextArray;

    let filterInput = document.createElement("input");
    filterInput.id = tagType.FILTER + tag.INPUT + row;
    filterInput.placeholder = "filter";
    filterInput.className = "input-filter";
    filterInput.type = "text";
    filterInput.onkeyup = saveContextArray;

    let deleteButton = document.createElement("button");
    deleteButton.id = tagType.DELETE + tag.BUTTON + row;
    deleteButton.innerHTML = "X";
    deleteButton.className = "btn-delete";
    deleteButton.addEventListener('click', deleteRow)

    li.id = row;
    li.appendChild(nameInput);
    li.appendChild(valueInput);
    li.appendChild(filterInput);
    li.appendChild(deleteButton);

}

function deleteRow() {
    const row = document.getElementById(this.id).parentElement;
    console.log(row.parentElement)
    if (row.parentElement.childElementCount === 1) {
        buttonsDiv.style.display = 'none';
    }
    row.remove();
    saveContextArray();
}


function clear() {
    chrome.storage.sync.set({coolheaded_context_array:  []}, function() {
        contextArray = [];
        let ul = document.getElementById("context_list");
        ul.innerHTML = '';
        buttonsDiv.style.display = 'none';
    });
}


function fillRows(contextArray) {
    let nameInput;
    let valueInput;
    let filterInput;
    let ul = document.getElementById("context_list");
    for (let i = 0; i < contextArray.length; i++) {
        let li = document.createElement("li");
        createRow(li, i);
        ul.appendChild(li);
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
    for (let i = 0; i < items.length; i++) {
        [nameInput, valueInput, filterInput] = getContextInputs(items[i].id)
        contextArrayToSave.push({
            name: nameInput.value,
            value: valueInput.value,
            filter: filterInput.value
        });
    }
    chrome.storage.sync.set({coolheaded_context_array:  contextArrayToSave}, function() {
        console.log('Value is set to ' + contextArrayToSave);
        contextArray = contextArrayToSave;
        return true;
    });
}


function getContextInputs(i) {
    const nameInput = document.getElementById(tagType.NAME + tag.INPUT + i);
    const valueInput = document.getElementById(tagType.VALUE + tag.INPUT + i);
    const filterInput = document.getElementById(tagType.FILTER + tag.INPUT + i);
    return [nameInput, valueInput, filterInput];
}

