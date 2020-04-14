# Matrix Sentry Webhooks

A bot to receive Sentry webhook events and forward them to chosen rooms.

Main features:

* Supports both Integration Platform webhooks and legacy webhook events.
* Uses pre-created Matrix user to send alerts using token auth
* Configurable room per alert receiver
* Automatic joining of configured rooms on start up (invite needed for private rooms)
* Verification of messages against the Sentry client key or `secret` query param for
  legacy integrations
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

The URL for both Integration Platform events and legacy webhook events is the following,
replacing `yourdomain.here` with your domain where the bot runs:

    https://yourdomain.here/receive

NOTE! The bot cannot talk HTTPS, so you need to have a reverse proxy in place to 
terminate SSL.

#### Integration platform

You'll need the Sentry Client Secret to be placed as the `SENTRY_CLIENT_SECRET`
environment variables. The bot will verify the signature of payloads by comparing
to a digest sent by Sentry in the request headers.

#### Legacy webhook events

You will need to configure a webhook integration in Sentry. 
Go to project "Settings" -> "Legacy integrations" -> "Webhooks". Enable for the
project and add an url pointing to your bot, postfixing the url with the query
parameter `?secret=foobar`, replacing `foobar` with a secret of your choice,
matching what is set as `SENTRY_CLIENT_SECRET` for the bot. Note, this does
not have to correlate with any real Sentry client secret.

## TODO

* Registering an account instead of having to use an existing account

## License

Apache 2.0
