import { useState } from 'react'
import './App.css'
import Intro from './slide/Intro'
import Warn from './slide/Warn'
import ChoiceMetaverse from './slide/ChoiceMetaverse'
import ChoiceRoom from './slide/ChoiceRoom'
import anime from 'animejs'
import Btn_start from './components/Btn_start'
import Btn_Middle from './components/Btn_middle'
import Btn_prev from './components/Btn_prev'
import addRoom from './api/Room'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import postToAirtable from './api/Room'


function App() {
	const [currentIndex, setActiveIndex] = useState(0);
	const [record, setRecord] = useState(
		{
			fields: {
				Customer: '고양시',
				Date: '2023-07-23',
				Status: '의뢰',
				Metaverse: 'ustory',
				Room: 'office',
				Link: 'youstory.room',
			},
		},
	);
	const ChangeStatus = (fieldName, value) => {
		setRecords((prevRecords) => {
			// Create a copy of the previous records array
			const updatedRecords = [...prevRecords];

			// Update the specified field of the current record (assuming it's the first record in this case)
			updatedRecords.fields[fieldName] = value;

			return updatedRecords;
		});
		console.log(record);
	};
	const next = () => {
		setActiveIndex((prevIndex) => (prevIndex + 1) % slide.length);
		animateProgressBar((currentIndex + 1) % slide.length);

	};
	const prev = () => {
		setActiveIndex((prevIndex) => (prevIndex + -1) % slide.length);
		animateProgressBar((currentIndex - 1 + slide.length) % slide.length);
	};

	const slide = [
		< Intro next={next} />,
		<Warn next={next} prev={prev} />,
		<ChoiceMetaverse next={next} prev={prev} />,
		<ChoiceRoom next={next} prev={prev} platform='ustory' change={ChangeStatus} />];

	const slideBtn = [
		<Btn_start next={next} />,
		<Btn_Middle next={next} prev={prev} />,
		<Btn_Middle next={next} prev={prev} />,
		<Btn_prev prev={prev} />

	];

	const animateProgressBar = (newValue: number) => {
		anime({
			targets: '.progress-info',
			value: newValue * 25,
			easing: 'easeInOutExpo',
			duration: 400,
		});
	};


	const sampleData = {
		records: [
			{
				fields: {
					Customer: '최대한',
					Date: '2023-07-23',
					Status: '의뢰',
					Metaverse: 'ustory',
					Room: 'office',
					Link: 'youstory.room',
				},
			},

		],
	};


	const mutation = useMutation((data) => postToAirtable(data), {
		onSuccess: (data) => {
			console.log('Mutation successful:', data);
		},
		onError: (error) => {
			console.error('Mutation error:', error);
		},
	});
	const addRoom = async (data: any) => {
		mutation.mutate(data);
	}
	const sendData = () => {
		addRoom(record);
	}

	return (

		<>
			<div className=" h-full sm:h-[1100px]  object-center sm:items-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500  bg-cover ">
				<div className="mx-auto w-full max-w-3xl h-full bg-white rounded-lg  flex flex-col justify-center items-center   sm:pt-10">
					<progress className="progress progress-info  mt-3 w-80 mx-10 items-center justify-center" value={25 * currentIndex} max="100"></progress>
					<div className='flex flex-col mt-3 px-10 '>
						<button onClick={sendData}>send data Test </button>

						{slide[currentIndex]}
						<div className='mt-1 fixed left-0 bottom-0
            flex justify-center items-center w-full mb-3'>
							{slideBtn[currentIndex]}
						</div>
					</div>
				</div>
			</div >
		</>
	);
}

export default App
