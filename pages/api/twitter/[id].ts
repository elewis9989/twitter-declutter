import type { NextApiRequest, NextApiResponse } from 'next';
import { TweetV2UserLikedTweetsPaginator, TwitterApi } from 'twitter-api-v2';

// Defines a twitter user
type User = {
  id: string;
  name: string;
  username: string;
  profile_image_url: string;
};

// Stores TwitterId: # of likes for that user
interface IHash {
  [key: string]: number;
}

// Stores TwitterId: user's data
interface IUserMap {
  [key: string]: User;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Grab Twitter Id and setup Twitter API Client
  const { id } = req.query;
  const twitterClient = new TwitterApi(process.env.BEARER_TOKEN as string);

  // Retrieve users most liked
  const data = await getTopUsers(twitterClient, id as string);

  res.status(200).send({ users: data });
}

async function getTopUsers(twitterClient: TwitterApi, userId: string) {
  // Grab recent liked tweets
  const responseStreams = await getAllLikedTweets(
    twitterClient,
    userId as string
  );
  if (!responseStreams) return;

  let usersMap: IUserMap = {}; // User ID to User Data
  let likedTweets: any = []; // Liked Tweets

  for (const data of responseStreams) {
    const jsonData = JSON.parse(data.toString());
    const tweetsChunk = jsonData._realData.data;
    const usersChunk: User[] = jsonData._realData.includes.users;

    // Place liked tweets in array
    for (const tweet of tweetsChunk) {
      likedTweets.push(tweet);
    }

    // See if we already have the author's (user) data
    for (const user of usersChunk) {
      if (!usersMap[user.id]) usersMap[user.id] = user;
    }
  }

  return getCounts(likedTweets, usersMap);
}

function getCounts(likedTweets: any, usersMap: IUserMap) {
  let data = [];

  let userLikedMap: IHash = {};

  // Go through all liked tweets and tally up for each author
  for (const tweet of likedTweets) {
    if (!userLikedMap[tweet.author_id]) {
      userLikedMap[tweet.author_id] = 1;
    } else {
      userLikedMap[tweet.author_id] = userLikedMap[tweet.author_id] + 1;
    }
  }

  // sort by number of likes
  const sortedList = Object.keys(userLikedMap).sort((a, b) => {
    return userLikedMap[b] - userLikedMap[a];
  });

  // finalize data structure to return to client
  for (const userId of sortedList) {
    data.push({
      name: usersMap[userId].name,
      username: usersMap[userId].username,
      totalLikes: userLikedMap[userId],
      profilePic: usersMap[userId].profile_image_url,
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
      'user.fields': ['name', 'username', 'profile_image_url'],
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
      'user.fields': ['name', 'username', 'profile_image_url'],
    });
    return res;
  } catch (error) {
    console.log(error);
  }
}
