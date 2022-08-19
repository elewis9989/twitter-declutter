import type { NextApiRequest, NextApiResponse } from 'next';
import { TweetV2UserLikedTweetsPaginator, TwitterApi } from 'twitter-api-v2';

type User = {
  id: string;
  name: string;
  username: string;
};

interface IHash {
  [key: string]: number;
}

interface IUserMap {
  [key: string]: User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;
  const twitterClient = new TwitterApi(process.env.BEARER_TOKEN as string);

  const data = await getTopUsers(twitterClient, id as string);
  res.status(200).send({ data: data });
}

async function getTopUsers(twitterClient: TwitterApi, userId: string) {
  const responseStreams = await getAllLikedTweets(
    twitterClient,
    userId as string
  );
  if (!responseStreams) return;

  let usersMap: IUserMap = {};
  let likedTweets: any = [];

  for (const data of responseStreams) {
    const jsonData = JSON.parse(data.toString());
    const tweetsChunk = jsonData._realData.data;
    const usersChunk: User[] = jsonData._realData.includes.users;

    for (const tweet of tweetsChunk) {
      likedTweets.push(tweet);
    }

    for (const user of usersChunk) {
      if (!usersMap[user.id]) usersMap[user.id] = user;
    }
  }

  return getCounts(likedTweets, usersMap);
}

function getCounts(likedTweets: any, usersMap: IUserMap) {
  let data = [];

  let userLikedMap: IHash = {};

  for (const tweet of likedTweets) {
    if (!userLikedMap[tweet.author_id]) {
      userLikedMap[tweet.author_id] = 1;
    } else {
      userLikedMap[tweet.author_id] = userLikedMap[tweet.author_id] + 1;
    }
  }

  const sortedList = Object.keys(userLikedMap).sort((a, b) => {
    return userLikedMap[b] - userLikedMap[a];
  });

  for (const userId of sortedList) {
    data.push({
      name: usersMap[userId].name,
      username: usersMap[userId].username,
      totalLikes: userLikedMap[userId],
    });
  }

  return data;
}

async function getAllLikedTweets(
  twitterClient: TwitterApi,
  userId: string,
  times = 1
) {
  try {
    let stream = [];

    let promise = getLikedTweets(twitterClient, userId);
    let result: TweetV2UserLikedTweetsPaginator = await promise;

    let iteration = 1;
    while (result.meta.next_token && iteration < times) {
      stream.push(JSON.stringify(result));

      let nextPromise = getLikedTweetsByToken(
        twitterClient,
        userId,
        result.meta.next_token,
        100
      );

      result = await nextPromise;
      iteration++;
    }

    stream.push(JSON.stringify(result));

    return stream;
  } catch (error) {
    console.log(error);
  }
}

async function getLikedTweets(
  twitterClient: TwitterApi,
  userId: string,
  max?: number
) {
  try {
    const res: any = await twitterClient.v2.userLikedTweets(userId, {
      max_results: max !== undefined ? max : 100,
      expansions: ['author_id'],
      'user.fields': ['name', 'username'],
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}

async function getLikedTweetsByToken(
  twitterClient: TwitterApi,
  userId: string,
  pagination_token: string,
  max?: number
) {
  try {
    const res: any = await twitterClient.v2.userLikedTweets(userId, {
      pagination_token: pagination_token,
      max_results: max !== undefined ? max : 100,
      expansions: ['author_id'],
      'user.fields': ['name', 'username'],
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
