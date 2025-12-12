# # backend/Dockerfile

# # 1) PHP + Apache base image
# FROM php:8.2-apache

# # 2) System packages Composer needs (git + unzip)
# RUN apt-get update \
#   && apt-get install -y --no-install-recommends \
#       git \
#       unzip \
#   && rm -rf /var/lib/apt/lists/*

# # 3) Enable mod_rewrite for pretty URLs (/graphql routed via .htaccess)
# RUN a2enmod rewrite

# # 4) PHP extensions used by your app
# RUN docker-php-ext-install pdo pdo_mysql

# # 5) Install Composer inside the image
# COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# # 6) Set working directory
# WORKDIR /var/www/html

# # 7) Copy ONLY backend code into the image (Render build context = backend/)
# COPY . /var/www/html

# # 8) Install PHP dependencies
# RUN COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_MEMORY_LIMIT=-1 \
#     composer install \
#       --no-dev \
#       --prefer-dist \
#       --no-scripts \
#       --ignore-platform-reqs \
#       --optimize-autoloader \
#       --no-interaction \
#       --no-progress

# # 9) Apache document root should point to /public
# ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

# RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf \
#     && sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# EXPOSE 80

# CMD ["apache2-foreground"]