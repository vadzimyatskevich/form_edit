# form_edit
simple online form editor

table creation:

CREATE DATABASE kakadu;

CREATE TABLE `kakadu`.`forms` ( `id` INT NOT NULL AUTO_INCREMENT , `name` VARCHAR(250) NULL , `form` VARCHAR(2500) NULL , `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP , PRIMARY KEY (`id`)) ENGINE = InnoDB;

 to run server: 
 1. cd "project root"
 2. php -S localhost:8888   (or 0.0.0.0:PORT to make the web server accessible to any interface)

