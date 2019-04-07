import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as SuccessRecordsState from '../store/Successes';

// At runtime, Redux will merge together...
type SuccessInTwoMinutesProps =
	SuccessRecordsState.SuccessRecordsState        // ... state we've requested from the Redux store
	& typeof SuccessRecordsState.actionCreators      // ... plus action creators we've requested
    & RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

class FetchSuccessRecords extends React.Component<SuccessInTwoMinutesProps, { successRecords: SuccessRecordsState.SuccessRecord[], text: string }> {
	constructor(ps: SuccessInTwoMinutesProps) {
		super();
		this.state = {
			successRecords: ps.successRecords,
			text: ''
		};
	}
	componentWillMount() {
		// This method runs when the component is first added to the page
		let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
		this.props.requestSuccessRecords(startDateIndex);
	}

	componentWillReceiveProps(nextProps: SuccessInTwoMinutesProps) {
		// This method runs when incoming props (e.g., route params) change
		let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
		this.props.requestSuccessRecords(startDateIndex);
		this.state = {
			successRecords: nextProps.successRecords,
			text: ''
		};
	}

	public render() {
		return <div>
			<h1>Success in 2 minutes</h1>
			<p>This component contains records list.</p>
			{this.renderForecastsTable()}
			{this.renderPagination()}
			{this.renderInputField()}
		</div>;
	}

	private renderForecastsTable() {
		return <table className='table'>
			<thead>
				<tr>
					<th>Date</th>
					<th>Text</th>
				</tr>
			</thead>
			<tbody>
				{this.props.successRecords.map(successRecord =>
					<tr>
						<td>{successRecord.dateFormatted}</td>
						<td>{successRecord.successText}</td>
						<td>
							<button className='btn btn-default' onClick={() => this.onRemove(successRecord)}>Remove</button>
						</td>
					</tr>
				)}
			</tbody>
		</table>;
	}

	private getDate() {
		var currentdate = new Date();
		var day = currentdate.getDate() < 10 ? "0" + currentdate.getDate() : currentdate.getDate();
		var currentMonth = currentdate.getMonth() + 1;
		var month = currentMonth < 10 ? "0" + currentMonth : currentMonth;

		return day + "." + month + "." + currentdate.getFullYear();
	}

	onSave() {
		if (this.state.text === '') return;

		var datetime = this.getDate();
		var record = { dateFormatted: datetime, successText: this.state.text };
		this.props.addRecord(record);
	}

	onRemove(record: SuccessRecordsState.SuccessRecord) {
		var arr = this.state.successRecords;
		var index = arr.indexOf(record);
		arr.splice(index, 1);

		this.setState({
			successRecords: arr,
			text: ''
		});

		this.props.removeRecord(record);
	}

	onInputChange(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			text: event.target.value
		});
	}

	private renderInputField() {
		return <p className='clearfix text-center'>
			<input type="text" onChange={(event) => this.onInputChange(event)} value={this.state.text} />
			<button className='btn btn-default' onClick={() => this.onSave()}>Save</button>
		</p>;
	}

    private renderPagination() {
        let prevStartDateIndex = (this.props.startDateIndex || 0) - 5;
        let nextStartDateIndex = (this.props.startDateIndex || 0) + 5;

        return <p className='clearfix text-center'>
			<Link className='btn btn-default pull-left' to={ `/fetchsuccessrecords/${ prevStartDateIndex }` }>Previous</Link>
			<Link className='btn btn-default pull-right' to={ `/fetchsuccessrecords/${ nextStartDateIndex }` }>Next</Link>
            { this.props.isLoading ? <span>Loading...</span> : [] }
        </p>;
    }
}

export default connect(
	(state: ApplicationState) => state.successes,		// Selects which state properties are merged into the component's props
	SuccessRecordsState.actionCreators                 // Selects which action creators are merged into the component's props
)(FetchSuccessRecords) as typeof FetchSuccessRecords;
