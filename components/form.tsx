import { useSession, signIn, signOut } from 'next-auth/react';
import { FaTwitter } from 'react-icons/fa';
import { BsBoxArrowLeft } from 'react-icons/bs';
import { GetStaticProps } from 'next';
import { useEffect, useState } from 'react';
import type { Session } from 'next-auth';

export const getStaticProps: GetStaticProps = async () => {
  const res = await fetch('/api/twitter', {});
  const { data } = await res.json();

  return {
    props: { data },
  };
};

const Form = () => {
  const { data: session } = useSession();
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!session) return;

    fetch(`/api/twitter/${session.twitterId}`)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
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
  console.log(session);
  console.log(data);
  return (
    <div>
      <button
        className='rounded-md bg-blue-400 flex items-center justify-center px-6 min-h-[2rem] hover:ring-2 ring-offset-blue-600'
        onClick={() => signOut()}
      >
        <BsBoxArrowLeft color='white' className='mx-1' />
        <p className='mx-1 text-white font-semibold'>Sign out</p>
      </button>
      <p>{session.user?.name}</p>
    </div>
  );
};

export default Form;
