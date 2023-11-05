import Head from 'next/head';

const Custom404 = () => {
	return (
		<>
			<Head>
				<title>404</title>
			</Head>

			<main>
				<section className='relative mx-auto my-[6.25rem] block w-[80%] text-center'>
					<div className='relative z-[2] inline-block h-[15.625rem] text-[13.75rem] tracking-[1rem]'>
						404
					</div>
					<hr className='z-[-10] mx-auto my-0 h-2 w-[26.25rem] border-t-4 border-solid border-white p-0 text-center text-white after:relative after:inline-block after:px-1 after:py-0 after:text-3xl after:content-[\u2022]' />
					<div className='relative my-2 block text-center text-[4em] leading-[80%] tracking-[0.75rem]'>
						THE PAGE
					</div>
					<div className='relative my-2 block text-center text-xl'>
						WAS NOT FOUND
					</div>
				</section>
			</main>
		</>
	);
};

export default Custom404;
