# php_web_server
AWS SDK를 사용해서 MQTT client로써 통신하는 웹 서버

## 설치 요구사항
apache2, mysql, php, php-mysqli, composer가 설치되어야 합니다.

```
apt install apache2
apt install mysql-server
apt install php
apt install php-mysqli
```

php용 패키지 관리자 composer를 설치하고, aws sdk를 설치합니다.
```
curl -sS https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer
composer --version

composer require aws/aws-sdk-php
composer require php-mqtt/client
```
