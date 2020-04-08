# Matrix Sentry Webhooks

A bot to receive Sentry webhook events and forward them to chosen rooms.

Main features:

* Uses pre-created Matrix user to send alerts using token auth
* Configurable room per alert receiver
* Automatic joining of configured rooms on start up (invite needed for private rooms)
* Verification of messages against the Sentry client key
* HTML formatted messages

## How to use

### Configuration

Whether running manually or via the Docker image, the configuration is set via 
environment variables. When running manually, copy `.env.default` into `.env`, 
set the values and they will be loaded automatically. When using the Docker image, 
set the environment variables when running the container.

### Docker

The Docker image is the easiest way to get the service running. 
Ensure you set the required environment variables listed in `.env.default` in this 
repository.

### Sentry

You will need to configure a webhook integration in Alertmanager. 
Go to project "Settings" -> "Legacy integrations" -> "Webhooks". Enable for the
project and add an url pointing to your bot, replacing the following URL with
your domain:

    https://yourdomain.here/receive

NOTE! The bot cannot talk HTTPS, so you need to have a reverse proxy in place to 
terminate SSL.

## TODO

* Registering an account instead of having to use an existing account

## License

Apache 2.0
