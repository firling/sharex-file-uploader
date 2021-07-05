# Sharex-File-uploader

Nodejs server to upload file to your personnal server using sharex custom upload.

____________________________________

## Installation

Here is the list of commands to install the project:

- `git clone https://github.com/firling/sharex-file-uploader.git`
- `cd sharex-file-uploader`
- `npm i`


Then, add .env file to the root of the folder:
```
PORT=3321
SECRET=YourSharexSecret
SSL_PATH=/path/to/your/ssl/files/
```

#### Running in developpment

`node index.js`

#### Running in production

using pm2:
`pm2 start index.js`

## Sharex Config

Method: POST
URL: https://yourdomain.com:3321/api/postFile

Corps: Form data
```
{
    "secret": "YourSharexSecret"
}
```

Name of the form file: sharex

## File Access
You can access to your file using this url:
https://yourdomain.com:3321/static/filename.ext