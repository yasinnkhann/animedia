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
      className='group text-inherit no-underline'
    >
      <section className='rounded-lg pb-4 transition-colors hover:bg-muted/50'>
        <div className='relative h-[20rem] cursor-pointer overflow-hidden rounded-t-lg'>
          <Image
            className='rounded-t-lg object-cover transition-transform duration-300 group-hover:scale-105'
            src={CommonMethods.getTheMovieDbImage(person.profile_path)}
            alt={person.name}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
          />
        </div>

        <div className='ml-4 mt-2'>
          <h3 className='cursor-pointer transition-colors group-hover:text-primary'>
            {person.name}
          </h3>
        </div>
      </section>
    </Link>
  );
};

export default PersonCard;
