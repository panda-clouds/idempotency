## PCParseRunner Changelog

### 0.24.1
- Fixed insertOne failing when a property is set to "null"

### 0.24.0
- Moved moment from "dev dep" to "dep"
- npm audit fix

### 0.23.0

- added inflating of pointers and date objects from a JSON file.

### 0.22.0

- added getClock()

### 0.21.0

- added spec for Clock functionality added to Parse-Coverage
- added setClock and resetClock

### 0.20.0

- removed coverageDir and replaced with only a bool that turns coverage off

### 0.19.0

- bumped default parse-server version to 3.4.4
- added test for throwing error with a spec helper

### 0.18.0

- added "helperClass" and "callHelper"
- moved .nyc_output and .nyc_cache to coverage for easy deleting and ignoring since...
- we gave up on jest direct unit tests because jest deletes the 'coverage' directory each time and can't be configured

### 0.17.0

- conformed to nyc standard directories in an attempt to combines reports

### 0.16.0

- added the ability to inject functions into a spec for testing

### 0.15.0

- fixed bug where code coverage was incomplete because "cloud" volume was removed too early

### 0.14.0

- fixed "setNewUrlParser" to "useNewUrlParser"

### 0.13.0

- added code coverage to the docker container

### 0.11.0

- Turned off "npm install" by default
- changed default location of "main.js"
- fixed tests pointing to main.js
- checked in node_modules for faster testing
- added "prodImageAndTag" for exact prod testing

### 0.10.0

- added prefill mongo function

### 0.9.0

-fixed port issue where dockerfile overrides the port back to 1337

### 0.8.0

- added serverConfig
- added insertOne
- added insertMany
- added No Cloud Code spec and fix

### 0.7.0

- changed mongoURL to "mongodb" instead of "http"

### 0.6.0

- exposed mongoURL

### 0.5.0

- upgraded npm packages

### 0.4.0

- changed "loadFile" to "projectDir"
- fixed ci errors

### 0.3.0

- returned the Parse global for setting in Test scope

### 0.2.0

- added logs for when parse server crashes

### 0.1.0

- initial Commit