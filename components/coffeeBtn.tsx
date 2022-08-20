import Image from 'next/image';

const CoffeeBtn = () => {
  return (
    <a
      href='https://www.buymeacoffee.com/roze'
      target='_blank'
      rel='noreferrer'
      className='rounded-md bg-yellow-300 flex pl-2 pr-4 items-center justify-center py-2 text-black hover:ring-2 ring-yellow-600 font-cookie'
    >
      <Image
        src='/bmc-logo-yellow.png'
        alt='Buy Me a Coffe Logo'
        width={24}
        height={24}
      />
      <p>Buy me a chai</p>
    </a>
  );
};

export default CoffeeBtn;
