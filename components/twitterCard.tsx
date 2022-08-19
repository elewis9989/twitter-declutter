import { TwitterUserLiked } from '../lib/types';
import Image from 'next/image';

const TwitterCard = ({
  name,
  username,
  totalLikes,
  profilePic,
}: TwitterUserLiked) => {
  return (
    <div className='grid grid-cols-3 gap-2'>
      <Image
        src={profilePic}
        alt={`Twitter profile picture of user ${username}`}
        width={48}
        height={48}
        className='rounded-full'
        layout='fixed'
      />

      <p>@{username}</p>
      <p>Likes: {totalLikes}</p>
    </div>
  );
};

export default TwitterCard;
