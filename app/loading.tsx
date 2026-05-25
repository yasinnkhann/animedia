import { Circles } from 'react-loading-icons';

export default function Loading() {
  return (
    <section className='flex h-screen items-center justify-center'>
      <Circles className='h-[8rem] w-[8rem]' stroke='#00b3ff' />
    </section>
  );
}
