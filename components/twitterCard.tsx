import { TwitterUserLiked } from '../lib/types';
import Image from 'next/image';

const TwitterCard = ({
  name,
  username,
  totalLikes,
  profilePic,
}: TwitterUserLiked) => {
  return (
    <div className='grid grid-cols-3 sm:gap-4 items-center justify-center'>
      <div className='flex items-center sm:col-span-2 col-span-3'>
        <Image
          src={profilePic}
          alt={`Twitter profile picture of user ${username}`}
          width={48}
          height={48}
          className='rounded-full px-2'
          layout='fixed'
        />
        <a
          href={`https://twitter.com/${username}`}
          className='italic dark:hover:text-indigo-200 hover:text-indigo-300 transition duration-200 text-sm px-4'
          target='_blank'
          rel='noreferrer'
        >
          @{username}
        </a>
      </div>
      <p className='italic text-sm'>Likes: {totalLikes}</p>
    </div>
  );
};

export default TwitterCard;
