import React from 'react';

interface Props {}

const DropDown = (props: Props) => {
	return (
		<form className='w-full p-20'>
			<fieldset>
				<div className='relative border border-gray-300 text-gray-800 bg-white shadow-lg'>
					<label htmlFor='frm-whatever' className='sr-only'>
						My field
					</label>
					<select
						className='appearance-none w-full py-1 px-2 bg-white'
						name='whatever'
						id='frm-whatever'
					>
						<option value=''>Please choose&hellip;</option>
						<option value='1'>Item 1</option>
						<option value='2'>Item 2</option>
						<option value='3'>Item 3</option>
					</select>
					<div className='pointer-events-none absolute right-0 top-0 bottom-0 flex items-center px-2 text-gray-700 border-l'>
						<svg
							className='h-4 w-4'
							xmlns='http://www.w3.org/2000/svg'
							viewBox='0 0 20 20'
						>
							<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
						</svg>
					</div>
				</div>
			</fieldset>
		</form>
	);
};

export default DropDown;
