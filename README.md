# Hotmail Junk Removal Tool

Automatically remove junk from your Hotmail account on a schedule.

## Docker Setup

This project includes a Dockerfile that:

1. Runs the application immediately when the container starts
2. Sets up a cron job to run the application every hour from 9am to 5pm, 7 days a week

### Using Docker Compose (Recommended)

This project includes a Docker Compose configuration that uses Docker secrets for secure credential management.

1. Create a directory for your secrets:
   ```bash
   mkdir -p secrets
   ```

2. Create the secret files:
   ```bash
   echo "your_client_id_here" > secrets/client_id.txt
   echo "your_discord_webhook_url_here" > secrets/discord_url.txt
   ```

3. Start the container using Docker Compose:
   ```bash
   docker-compose up -d
   ```

The Docker Compose configuration:

- Sets the timezone to America/New_York
- Uses Docker secrets for secure credential management
- Persists the authentication cache between restarts

### Building and Running with Docker (Alternative)

#### Building the Docker Image

```bash
docker build -t hotmail-junk-removal-tool .
```

#### Running the Docker Container

```bash
docker run -d --name hotmail-junk-removal \
  -e CLIENT_ID=your_client_id_here \
  -e DISCORD_URL=your_discord_webhook_url_here \
  hotmail-junk-removal-tool
```

Replace `your_client_id_here` with your Microsoft application client ID and `your_discord_webhook_url_here` with your
Discord webhook URL.

#### Escaping the Discord Webhook URL

Discord webhook URLs contain special characters that may need to be escaped when used in shell commands. Here's how to
properly escape the URL:

1. **For Bash/Sh shells**: Use single quotes around the entire URL to prevent special character interpretation:
   ```bash
   -e DISCORD_URL='https://discord.com/api/webhooks/your/webhook/url'
   ```

2. **If you need to use double quotes** (for example, if the URL itself contains single quotes), escape special
   characters with backslashes:
   ```bash
   -e DISCORD_URL="https://discord.com/api/webhooks/your/webhook/url"
   ```

3. **For Windows Command Prompt**: Use double quotes and escape any existing double quotes with backslashes:
   ```cmd
   -e DISCORD_URL="https://discord.com/api/webhooks/your/webhook/url"
   ```

4. **For PowerShell**: Use single quotes for the entire URL:
   ```powershell
   -e DISCORD_URL='https://discord.com/api/webhooks/your/webhook/url'
   ```

### Viewing Logs

```bash
docker logs -f hotmail-junk-removal
```

## Manual Setup

If you prefer to run the application without Docker:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the application:
   ```bash
   npm run main
   ```

3. To set up a cron job manually, add the following to your crontab:
   ```
   0 9-17 * * * cd /path/to/project && npm run main
   ```

## Authentication

The application requires authentication with Microsoft services. Make sure your authentication tokens are properly
configured.

## Environment Variables

This application requires the following environment variables:

- `CLIENT_ID`: Your Microsoft application client ID used for authentication with Microsoft Graph API
- `DISCORD_URL`: Discord webhook URL for sending notifications about deleted and ignored junk emails

These can be provided when running the Docker container using the `-e` flag as shown in the "Running the Docker
Container" section above.
