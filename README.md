## ## lims-frontend

### Run build and local development
1. Rename .env-cmdrc.template to .env-cmdrc
2. If you run local build please use **local** env (npm run build:local)
3. If you run build for any lab please see **package.json** file in script object

## Here is env for each lab:

### QA - npm run build:mirimus-qa
    "mirimus-qa": {
        "REACT_APP_API_URL": "https://qa.api.lims.mirimus.com/v1",
        "REACT_APP_LAB_ID": "mirimus",
        "NODE_ENV": "qa",
        "REACT_APP_VERSION": "$npm_package_version",
        "REACT_APP_SENTRY_ENV": "qa",
        "REACT_APP_SENTRY_DSN": "https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14"
    }
### Mirimus PROD - npm run build:mirimus-prod
    "mirimus-prod": {
        "REACT_APP_API_URL": "https://api.lims.mirimus.com/v1",
        "REACT_APP_LAB_ID": "mirimus",
        "NODE_ENV": "production",
        "REACT_APP_VERSION": "$npm_package_version",
        "REACT_APP_SENTRY_ENV": "production",
        "REACT_APP_SENTRY_DSN": "https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14"
    }
### Wynn - npm run build:wynn
    "wynn-prod": {
        "REACT_APP_API_URL": "https://wynn.api.lims.mirimus.com/v1",
        "REACT_APP_LAB_ID": "wynn",
        "NODE_ENV": "production",
        "REACT_APP_VERSION": "$npm_package_version",
        "REACT_APP_SENTRY_ENV": "wynn",
        "REACT_APP_SENTRY_DSN": "https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14"
    }
### Accelevir - npm run build:aclv
    "accelevir-prod": {
        "REACT_APP_API_URL": "https://accelevir.api.lims.mirimus.com/v1",
        "REACT_APP_LAB_ID": "aclv",
        "NODE_ENV": "production",
        "REACT_APP_VERSION": "$npm_package_version",
        "REACT_APP_SENTRY_ENV": "accelevir",
        "REACT_APP_SENTRY_DSN": "https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14"
    }
### local - npm run build:local
    "local": {
        "REACT_APP_API_URL": "LINK_TO_YOU_API",
        "REACT_APP_LAB_ID": "mirimus",
        "NODE_ENV": "local",
        "REACT_APP_VERSION": "$npm_package_version",
        "REACT_APP_SENTRY_ENV": "local",
        "REACT_APP_SENTRY_DSN": "https://5fe6afa6c0b34747ae480c508935c33b@sentry.mirimus.com/14"
    }

