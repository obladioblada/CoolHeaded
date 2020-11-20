# CoolHeaded
web extension for header parameters injection

### Installation

#### chrome:
- enter "chrome://extensions/" in the URL bar
- enable Developer mode if disabled
- click "Load Unpacked"
- import the extension directory
 
#### firefox:

You need to use chrome to create a .crx file. In order to do that:
- enter "chrome://extensions/" in the URL bar
- enable Developer mode if disabled
- click pack extension
- load the coolHeaded directory

Once you have the Coolheaded.crx file:

- enter "about:debugging" in the URL bar
- click "This Firefox"
- click "Load Temporary Add-on"
- load the Coolheaded.crx file

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



