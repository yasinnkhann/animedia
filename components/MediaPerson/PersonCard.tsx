import Image from 'next/image';
import { CommonMethods } from '../../utils/CommonMethods';
import Link from 'next/link';

interface Props {
  person: any;
  rank: number;
}

const PersonCard = ({ person }: Props) => {
  return (
    <Link
      href={CommonMethods.getDetailsPageRoute('person', person.id, person.name)}
      className='text-inherit no-underline'
    >
      <section>
        <div className='relative h-[20rem] cursor-pointer'>
          <Image
            className='rounded-lg'
            src={CommonMethods.getTheMovieDbImage(person.profile_path)}
            alt={person.name}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
          />
        </div>

        <div className='ml-4 mt-2'>
          <h3 className='cursor-pointer'>{person.name}</h3>
        </div>
      </section>
    </Link>
  );
};

export default PersonCard;
