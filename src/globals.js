global.DEBUG = false;
global.HOST = "localhost:5000"
global.APIPRE = `http://${global.HOST}`;

global.GH_OAUTH_CALLBACK = `${global.APIPRE}/v1/login`;
global.GH_OAUTH_CLIENT_ID = "*********************";
global.LoginUrl = `https://github.com/login/oauth/authorize?client_id=${encodeURIComponent(global.GH_OAUTH_CLIENT_ID)}&redirect_uri=${encodeURIComponent(global.GH_OAUTH_CALLBACK)}`;