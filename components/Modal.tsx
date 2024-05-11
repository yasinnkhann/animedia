import { ReactNode, useEffect, useRef } from 'react';
import { GrClose } from 'react-icons/gr';

interface Props {
	children?: ReactNode;
	closeModal: () => void;
}

const Modal = ({ children, closeModal }: Props) => {
	const contentRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const close = (e: KeyboardEvent) => {
			if (e.key === 'Escape') {
				closeModal();
			}
		};
		window.addEventListener('keydown', close);
		return () => window.removeEventListener('keydown', close);
	}, [closeModal]);

	const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
		if (contentRef.current?.contains(e.target as Node)) {
			return;
		}
		closeModal();
	};

	console.log(children);
	return (
		<>
			<section
				onClick={handleClickOutside}
				className='fixed left-0 top-0 z-[1] block h-full w-full overflow-auto bg-black bg-black/[0.4] pt-20'
			>
				<div
					className='relative m-auto h-[85vh] w-[70vw] overflow-scroll rounded bg-white p-4 scrollbar-hide'
					ref={contentRef}
				>
					<button onClick={() => closeModal()} className='float-right'>
						<GrClose className='h-6 w-6 text-gray-500 transition duration-300 hover:text-gray-700' />
					</button>
					{children}
				</div>
			</section>
		</>
	);
};

export default Modal;
