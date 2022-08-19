import { useSession, signIn, signOut } from 'next-auth/react';
import { FaTwitter } from 'react-icons/fa';
import { BsBoxArrowLeft } from 'react-icons/bs';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import TwitterCard from './twitterCard';
import { TwitterUserLiked } from '../lib/types';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('/api/twitter', {});
  const { data } = await res.json();

  return {
    props: { data },
  };
};

const Form = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<TwitterUserLiked[]>([]);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/twitter/${session.twitterId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data.users);
      });
  }, [session]);

  if (!session) {
    return (
      <button
        className='rounded-md bg-blue-400 flex items-center justify-center px-6 min-h-[2rem] hover:ring-2 ring-offset-blue-600'
        onClick={() => signIn()}
      >
        <FaTwitter color='white' className='mx-1' />
        <p className='mx-1 text-white font-semibold'>Sign in</p>
      </button>
    );
  }

  const usersToDisplay = data.slice(0, 5);
  return (
    <div className='flex flex-col items-center justify-center'>
      <div className='h-44 w-fit rounded-md bg-gray-50 overflow-auto my-4'>
        <ul>
          {usersToDisplay &&
            usersToDisplay.map((user, index) => (
              <li key={index} className='px-6 py-2'>
                <TwitterCard
                  name={user.name}
                  username={user.username}
                  totalLikes={user.totalLikes}
                  profilePic={user.profilePic}
                />
              </li>
            ))}
        </ul>
      </div>
      <button
        className='rounded-md bg-blue-400 flex items-center justify-center px-6 min-h-[2rem] hover:ring-2 ring-offset-blue-600 my-4'
        onClick={() => signOut()}
      >
        <BsBoxArrowLeft color='white' className='mx-1' />
        <p className='mx-1 text-white font-semibold'>Sign out</p>
      </button>
    </div>
  );
};

export default Form;
