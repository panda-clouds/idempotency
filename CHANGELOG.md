## Changelog

### 0.5.0
- Changed to using Parse.Error when available to leverage error "codes" for silently discarding there errors on the client

### 0.4.0

- when '', nil, null, undefined, or an empty variable is passed to "check" we know that the user just didn't provide a key VS failing.

### 0.3.0

- stopped the idempotencyKey from being saved to the object

### 0.2.0

- added Parse Server v2.x.x tests

### 0.1.0

- initial commit