# Outlook Junkmail Shredder

Automatically remove junk from your Outlook.com account on a schedule.

## Client id

The app looks for CLIENT_ID_FILE which contains an `Application (client) id` from Azure.
To create/update this:

- login to the Azure portal
- Select / create an app
- Visit App registrations

The app currently has API permissions:

- Graph > Mail.Read
- Graph > Mail.ReadWrite
- Graph > User.Read

## Usage

See refresh.sh and docker-compose.yml
