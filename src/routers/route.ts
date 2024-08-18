import { Request, Response, Router } from 'express';
import { slack } from '../constant';
import { authorizeSlackApp, sendSlackMessage } from '../slack';

const router: Router = Router();

interface SlackUsers {
  authed_user_id: string;
  channel_name: string;
  channel_id: string;
  webhook_url: string;
}

export const users: SlackUsers[] = [];

router.get('/slack/install', (req: Request, res: Response) => {
  const slackOAuthUrl = slack.urls.oauth;
  res.render('install-slack', {
    slackOAuthUrl,
  });
});

router.get('/slack/oauth/callback', async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const slackResponse = await authorizeSlackApp(code);
    const user = {
      authed_user_id: slackResponse.authed_user.id,
      channel_name: slackResponse.incoming_webhook.channel,
      channel_id: slackResponse.incoming_webhook.channel_id,
      webhook_url: slackResponse.incoming_webhook.url,
    };
    users.push(user);
    const webhookUrl = slackResponse.incoming_webhook.url;
    await sendSlackMessage(webhookUrl, slack.messages.welcome),
      res.status(200).send('Slack OAuth successful');
  } catch (error) {
    console.error('Error during OAuth callback:', error);
    res.status(500).send('An error occurred during Slack OAuth');
  }
});

router.post('/slack/message', async (req: Request, res: Response) => {
  const webhookUrl = req.body.webhook_url;
  try {
    await sendSlackMessage(webhookUrl);
    res.status(200).send('Message sent to Slack');
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    res.status(500).send('An error occurred while sending the message');
  }
});

router.get('/slack/users', (req: Request, res: Response) => {
  res.status(200).send(users);
});

export default router;
