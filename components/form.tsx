import { FaTwitter } from 'react-icons/fa';

const Form = () => {
  return (
    <button className='rounded-md bg-blue-400 flex items-center justify-center px-6 min-h-[2rem] hover:ring-2 ring-offset-blue-600'>
      <FaTwitter color='white' className='mx-1' />
      <p className='mx-1 text-white font-semibold'>Sign in</p>
    </button>
  );
};

export default Form;
