import * as React from 'react';

export interface GeneralResultProps {
}

interface GeneralResultState {
}

export class GeneralResult extends React.Component<GeneralResultProps, GeneralResultState> {
	constructor(props: GeneralResultProps) {
		super(props);
	}

	render() {
		return (
			<div>
				Here you will see result, sometimes!!
			</div>
		);
	}
}