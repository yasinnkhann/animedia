import PersonCard from './PersonCard';
import { RESULTS_PER_PAGE } from '../../utils/constants';

interface Props {
  results: any[];
}

const PeopleList = ({ results }: Props) => {
  return (
    <section className='mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
      {results.map((person: any, idx: number) => (
        <section key={`${person.id}-${idx}`}>
          <PersonCard person={person} rank={idx + 1} />
        </section>
      ))}
    </section>
  );
};

export default PeopleList;
