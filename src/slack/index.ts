import axios from 'axios';
import { slack } from '../constant';

async function authorizeSlackApp(code: string) {
  try {
    const response = await axios.post(
      'https://slack.com/api/oauth.v2.access',
      null,
      {
        params: {
          code,
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          redirect_uri: process.env.SLACK_REDIRECT_URI,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    throw new Error('An error occurred during Slack OAuth');
  }
}

async function joinSlackChannel(channelId: string, accessToken: string) {
  console.info('Joining Slack channel');
  try {
    await axios.post(
      'https://slack.com/api/conversations.join',
      { channel: channelId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.info('Slack channel joined');
  } catch (error) {
    console.error('Error joining Slack channel:', error);
    throw new Error('An error occurred while joining the channel');
  }
}

export async function sendSlackMessage(webhookUrl: string, message?: string) {
  try {
    console.info('Sending message to Slack');
    await axios.post(webhookUrl, {
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: message ?? slack.messages.custom,
          },
        },
        {
          type: 'divider',
        },
      ],
    });
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    throw new Error('An error occurred while sending the message');
  }
}
export { authorizeSlackApp, joinSlackChannel };



interface SlackMessage {
  hostname: string;
  commit_sha: string;
  commit_message: string;
  deploy_url: string;
}
