qldarch-frontend
==================

Running the Front End locally (pointing at qldarch server)
-----
* Install NPM
* Install yo, bower, grunt `npm install -g yo bower grunt-cli`
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
