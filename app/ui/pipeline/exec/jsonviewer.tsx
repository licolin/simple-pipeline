import React from 'react';
// import {useRef, useState} from 'react';

export interface EditType {
	indexOrName: string | number
	depth: number
	src: any
	parentType: 'object' | 'array' | null
	type: 'add' | 'edit' | 'delete'
}


// const example_info = {
// 	string: 'string',
// 	longString: 'long string long string long string long string long string long string',
// 	number: 123456,
// 	boolean: false,
// 	//null: null,
// 	func: function () {},
// 	Symbol: Symbol('JSON View'),
// 	obj: {
// 		k1: 123,
// 		k2: '123',
// 		k3: false
// 	},
// 	arr: ['string', 123456, false, null],
// 	link: 'https://github.com/'
// }


import JsonView from 'react18-json-view'
import 'react18-json-view/src/style.css'

// export default function JsonElement(){
// 	const [example, setExample] = useState(example_info);
//
// 	const handleJsonChange = (edit: EditType) => {
// 		// React18-JSON-View provides an updated src in edit.updated_src
// 		console.log(edit);
// 		setExample(edit.src);
// 	};
//     return (
// 		<>
// 			<div className="w-full mt-1">
// 				<JsonView onChange={handleJsonChange} src={example_info} editable={true} style={{fontSize: 13}} enableClipboard={false}/>
// 			</div>
// 		</>
//
// 	)
//
// }

export default function JsonElement({
										initialData,
										onJsonChange,
									}: {
	initialData: any; // Type for initial data
	onJsonChange: (edit: EditType) => void; // Type for the change handler
}) {
	return (
		<>
			<div className="w-full mt-1">
				<JsonView
					onChange={onJsonChange}
					src={initialData}
					editable={true}
					style={{ fontSize: 13 }}
					enableClipboard={false}
				/>
			</div>
		</>
	);
}