Запуск для os x

Перед запуском проекта необходимо:

1. Установить Homebrew

2. Установить Node.js (v.7.10.0)

$ brew install nvm

$ nvm install 7.10.0

3. Установить MongoDB

$ brew install mongodb

4. Клонируем проект

git clone https://github.com/storonaot/medical-card-api.git

5. Переходим в проект и инсталируем зависимости

$ cd medical-card-api

$ npm i

Для запуска проекта:

$ supervisor app

или

$ node app
