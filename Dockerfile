# Start with Node, for webpack
FROM node:lts-alpine3.21 AS build
COPY ./ /app
WORKDIR /app
RUN npm install && npm run prod

# Now the PHP/Apache base container
FROM php:8.3.19-apache
WORKDIR /var/www/html

# Set environment variables with some default settings for build purposes
# The actual values are irrelevant; we replace later with compose env vars
ENV BASE_URI="localhost" \
    ADMIN_EMAIL="admin@localhost" \
    IP_PROXY="192.168.1.0/24" \
    CSP_SRC="" \
    CSP_FONT="" \
    CSP_FRAME="" \
    CORS_ORIGINS=""

# custom Apache and PHP config files
COPY ./apache.conf /etc/apache2/sites-available/mysite.conf
COPY ./php.ini /usr/local/etc/php/php.ini

# Copy the website files into the container
# NOTE that we override this in the compose file for live reload,
# but it's convenient to do this so one Dockerfile can handle both
# dev and prod builds
COPY ./site ./

# And copy in the webpack output:
COPY --from=build /app/dist ./dist/

# what php extensions are needed?
RUN apt-get update && apt-get install -y \
		libfreetype6-dev \
		libjpeg62-turbo-dev \
        libwebp-dev \
		libpng-dev \
        libbz2-dev \
        libcap2-bin \
        sudo \
        libonig-dev \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg --with-webp \
	&& docker-php-ext-install -j$(nproc) pdo pdo_mysql mbstring bz2 gd

# Fix a minor config issue and enable the site
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf && \
    # Hardening: reduce tokens to obfuscate what we're running (this will result in "Apache" instead of showing Apache and PHP versions
    echo "ServerTokens Prod" >> /etc/apache2/apache2.conf && \
    # Hardening: disable Trace HTTP request to stop cross-site cookie stealing attacks
    echo "TraceEnable off" >> /etc/apache2/apache2.conf && \
    # Allow non-root user to bind to port 80:
    setcap 'cap_net_bind_service=+ep' /usr/sbin/apache2 && \
    # Fix IP restriction in status page to allow internal networks
    # (I have no idea what Docker / K8s will choose but this is far safer than opening the page to the world):
    sed -i 's/#Require ip 192.0.2.0\/24/Require ip 10.0.0.0\/8 172.16.0.0\/12 192.168.0.0\/16/g' /etc/apache2/mods-enabled/status.conf && \
    # Enable the site and restart Apache
    a2enmod rewrite && \
    a2enmod remoteip && \
    a2enmod headers && \
    a2dissite 000-default && \
    a2ensite mysite && \
    apache2ctl stop && \
    apache2ctl start

# Fix permissions and change to non-root user
RUN chown -R 1000:1000 /var/www/html \
    && chmod -R 544 /var/www/html \
    && addgroup --system mysite --gid 1000 \
    && adduser --system --home /var/www/html --ingroup mysite --uid 1000 myuser

USER myuser
EXPOSE 80

CMD apache2-foreground
