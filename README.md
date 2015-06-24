qldarch-frontend
==================

Running the Front End locally (pointing at qldarch server)
-----

== Setting up ==
=== 1. Getting the Global Tools ===
* Install NPM
* Install the dev tools you need - yo, bower, grunt `npm install -g yo bower grunt-cli`
* Install generator for angular (does angular scaffolding) `npm install -g generator-angular`

=== 2. Installing Project Dependencies ===
* Run `npm install`
* Run `bower install`

=== 3. Running it Locally ===
* Run `grunt server`

So this is actually using an older version of the angular generator build process so there might be weird things with that.

The whole code base is pretty messy because it was written in a very short amount of time and honestly does a lot of stuff. Testing is basically non-existent. There are some end to end tests that use protractor.


* Create `secret.json` file in `angular/` with format (used for SFTP deployment):
```
{
    "host": "localhost",
    "username": GLADYS_USERNAME,
    "password": GLADYS_PASSWORD
}
```

