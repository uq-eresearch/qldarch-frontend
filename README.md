qldarch-frontend
==================

Setup
-----
* Install NPM (bunch of different wants to do this)
* Install yo `npm install -g yo`
* Install generator for angular `npm install -g generator-angular`
* Go to `angular` directory
* Run `npm install`
* Run `bower install`
* Create `secret.json` file in `angular/` with format (used for SFTP deployment):
```
{
    "host": "localhost",
    "username": GLADYS_USERNAME,
    "password": GLADYS_PASSWORD
}
```
* Run `grunt server`
