# CoolHeaded
web extension for header parameters injection

### Installation

#### chrome:

- enter "chrome://extensions/" in the URL bar
- click "Load Unpacked"
- import the extension directory
 
#### firefox:

- enter "about:debugging" in the URL bar
- click "This Firefox"
- click "Load Temporary Add-on"
- open the extension's directory and select the .crx file inside the extension.

### Filter 

A filter is a string used to match URL for injecting header parameters.
It needs to start with <b>http://</b> or <b>https://</b> followed by a full URL or substring of it.

###### example

- ```http://www.example.com/software/index.html```
- ```https://www.example.com/software/index.html  ```
- ```https://www.example.com/*  ```
- ```https://*/software/index.html  ```
- ```https://www.example.com/software/*  ```
- ```https://*.example.com/software/*  ```



