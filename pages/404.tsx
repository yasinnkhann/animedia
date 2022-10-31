import React from 'react';

const Custom404 = () => {
	return (
		<main>
			<section className='block my-[6.25rem] mx-auto relative text-center w-[80%]'>
				<div className='inline-block h-[15.625rem] relative z-[2] text-[13.75rem] tracking-[1rem]'>
					404
				</div>
				<hr className='border-white border-solid border-t-4 h-2 my-0 mx-auto p-0 text-center text-white w-[26.25rem] z-[-10] after:inline-block after:text-3xl after:py-0 after:px-1 after:relative after:content-[\u2022]' />
				<div className='block text-[4em] relative text-center tracking-[0.75rem] leading-[80%] my-2'>
					THE PAGE
				</div>
				<div className='text-center block relative text-xl my-2'>
					WAS NOT FOUND
				</div>
			</section>
		</main>
	);
};

export default Custom404;
