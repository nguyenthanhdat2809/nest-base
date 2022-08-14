#!/bin/bash

echo REACT_APP_HOST=$REACT_APP_HOST_SNP >> .env
echo REACT_APP_SOCKET_HOST=$REACT_APP_SOCKET_HOST_SNP >> .env
echo NODE_ENV=$NODE_ENV_SNP >> .env
echo SERVER_TIMEOUT=$SERVER_TIMEOUT_SNP >> .env
echo SERVER_PORT=$SERVER_PORT_SNP >> .env

echo DATABASE_HOST=$DATABASE_HOST_SNP >> .env
echo DATABASE_TYPE=postgres >> .env
echo DATABASE_PORT=$DATABASE_PORT_SNP >> .env
echo DATABASE_USERNAME=$DATABASE_USERNAME_SNP >> .env
echo DATABASE_PASSWORD=$DATABASE_PASSWORD_SNP >> .env
echo DATABASE_NAME=$DATABASE_NAME_SNP >> .env
echo DATABASE_CONNECTION_TIME_OUT=150000 >> .env
echo DATABASE_ACQUIRE_TIME_OUT=150000 >> .env
echo DATABASE_CONNECTION_LIMIT=20 >> .env

echo JWT_ACESS_TOKEN_SECRET=$JWT_ACESS_TOKEN_SECRET_SNP >> .env
echo JWT_ACESS_TOKEN_EXPIRES_IN=$JWT_ACESS_TOKEN_EXPIRES_IN_SNP >> .env
echo JWT_RESFRESH_TOKEN_SECRET=$JWT_RESFRESH_TOKEN_SECRET_SNP >> .env
echo JWT_RESFRESH_TOKEN_EXPIRES_IN=$JWT_RESFRESH_TOKEN_EXPIRES_IN_SNP >> .env

echo USER_SERVICE_PORT=$USER_SERVICE_PORT_SNP >> .env
echo USER_SERVICE_HOST=$USER_SERVICE_HOST_SNP >> .env

echo WAREHOUSE_SERVICE_PORT=$WAREHOUSE_SERVICE_PORT_SNP >> .env
echo WAREHOUSE_SERVICE_HOST=$WAREHOUSE_SERVICE_HOST_SNP >> .env

echo ITEM_SERVICE_PORT=$ITEM_SERVICE_PORT_SNP >> .env
echo ITEM_SERVICE_HOST=$ITEM_SERVICE_HOST_SNP >> .env

echo SALE_SERVICE_PORT=$SALE_SERVICE_PORT_SNP >> .env
echo SALE_SERVICE_HOST=$SALE_SERVICE_HOST_SNP >> .env

echo SETTING_SERVICE_PORT=$SETTING_SERVICE_PORT_SNP >> .env
echo SETTING_SERVICE_HOST=$SETTING_SERVICE_HOST_SNP >> .env

echo PRODUCE_SERVICE_PORT=$PRODUCE_SERVICE_PORT_SNP >> .env
echo PRODUCE_SERVICE_HOST=$PRODUCE_SERVICE_HOST_SNP >> .env

echo TEMPLATE_DIR=$TEMPLATE_DIR >> .env

echo CORS_ORIGINS=* >> .env