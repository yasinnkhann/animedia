import PersonCard from './PersonCard';
import { RESULTS_PER_PAGE } from '../../utils/constants';
import { PeopleRes } from '../../graphql/generated/code-gen/graphql';

interface Props {
	peopleData: PeopleRes;
	pageNum: number;
}

const PeopleList = ({ peopleData, pageNum }: Props) => {
	return (
		<section className='mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
			{peopleData.results.map((person, idx) => (
				<section key={person.id}>
					<PersonCard
						person={person}
						rank={pageNum * RESULTS_PER_PAGE - (RESULTS_PER_PAGE - idx) + 1}
					/>
				</section>
			))}
		</section>
	);
};

export default PeopleList;
