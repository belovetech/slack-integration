import dotenv from 'dotenv';

dotenv.config();

export const slack = {
  messages: {
    welcome:
      "'Welcome to Ignite Slack notification! 🎉 \nSee our <https://www.ignitelearning.io/docs|SLACK NOTIFICATION> for more info.'",
    custom: `<https://www.ignite.dev/deploy-page|*New Deploy* for *trio-control*>\n> <https://www.github.com/commit/sha|*4883bb1* >: Merge pull request #1 from ignite-learning/feature/ignite-123\n> (chore): update package.json\n> <https://trio-control-abcd.onignite.com|https://trio-control-abcd.onignite.com>`,
  },
  urls: {
    oauth: `https://slack.com/oauth/v2/authorize?client_id=${process.env.SLACK_CLIENT_ID}&scope=incoming-webhook&redirect_uri=${process.env.SLACK_REDIRECT_URI}`,
  },
};
