qldarch-frontend-2
==================

Setup
-----
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
