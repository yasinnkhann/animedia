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
        <div className='relative h-[20rem] cursor-pointer overflow-hidden rounded-t-lg shadow-sm transition-shadow duration-300 group-hover:shadow-md group-hover:shadow-primary/20'>
          <Image
            className='rounded-t-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
            src={CommonMethods.getTheMovieDbImage(person.profile_path)}
            alt={person.name}
            fill
            sizes='(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw'
          />
          <div className='absolute inset-0 flex flex-col items-center justify-end bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100'>
            <div className='mb-4 translate-y-4 rounded-full bg-primary/90 px-4 py-1 text-sm font-semibold text-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100'>
              View Profile
            </div>
          </div>
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
