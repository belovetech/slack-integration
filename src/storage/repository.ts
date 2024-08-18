import { Repository, Schema } from 'redis-om';
import Storage from './redis';

interface SlackUser {
  authed_user_id: string;
  channel_name: string;
  channel_id: string;
  webhook_url: string;
}

const schema = new Schema(
  'slack-users',
  {
    authed_user_id: { type: 'string' },
    channel_name: { type: 'string' },
    channel_id: { type: 'string' },
    webhook_url: { type: 'string' },
  },
  { dataStructure: 'HASH' }
);

export async function saveUser(user: SlackUser): Promise<SlackUser> {
  const redisClient = await Storage.getInstance();
  const repository = new Repository(schema, redisClient);
  await repository.createIndex();
  const savedUser = (await repository.save(user)) as SlackUser;
  // redisClient.disconnect();
  return savedUser;
}

export async function getUser(userId: string): Promise<SlackUser | null> {
  const redisClient = await Storage.getInstance();
  const repository = new Repository(schema, redisClient);
  const user = (await repository.fetch(userId)) as SlackUser;
  // redisClient.disconnect();
  return user;
}

export async function getUsers(): Promise<Record<string, any>> {
  const redisClient = await Storage.getInstance();
  const repository = new Repository(schema, redisClient);
  return await repository.search();
}

(async () => {
  const user = {
    authed_user_id: 'U07HT7VL80G',
    channel_name: '#ignite-alert',
    channel_id: 'C07H13CSFDL',
    webhook_url:
      'https://hooks.slack.com/services/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',
  };

  await saveUser(user);
  const users = await getUsers();
  console.log('Users:', users);
})();
