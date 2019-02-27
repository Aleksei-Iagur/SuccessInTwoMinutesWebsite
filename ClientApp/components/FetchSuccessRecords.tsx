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

class FetchSuccessRecords extends React.Component<SuccessInTwoMinutesProps, {}> {
    componentWillMount() {
        // This method runs when the component is first added to the page
		let startDateIndex = parseInt(this.props.match.params.startDateIndex) || 0;
		this.props.requestSucessRecords(startDateIndex);
    }

	componentWillReceiveProps(nextProps: SuccessInTwoMinutesProps) {
        // This method runs when incoming props (e.g., route params) change
        let startDateIndex = parseInt(nextProps.match.params.startDateIndex) || 0;
        this.props.requestSucessRecords(startDateIndex);
    }

    public render() {
        return <div>
            <h1>Success in 2 minutes</h1>
			<p>This component demonstrates fetching data from the server and working with URL parameters.</p>
			{this.renderForecastsTable()}
			{this.renderPagination()}
			{this.renderSaveButton()}
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
                <tr key={ successRecord.dateFormatted }>
						<td>{successRecord.dateFormatted}</td>
						<td>{successRecord.successText}</td>
                </tr>
            )}
            </tbody>
        </table>;
	}

	private renderSaveButton() {
		return <p className='clearfix text-center'>
			<button className='btn btn-default'>Save</button>
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
