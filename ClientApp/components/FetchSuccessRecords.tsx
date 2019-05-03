import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { ApplicationState } from '../store';
import * as SuccessRecordsState from '../store/Successes';
import * as ReactDOM from 'react-dom';

// At runtime, Redux will merge together...
type SuccessInTwoMinutesProps =
	SuccessRecordsState.SuccessRecordsState        // ... state we've requested from the Redux store
	& typeof SuccessRecordsState.actionCreators      // ... plus action creators we've requested
	& RouteComponentProps<{ startDateIndex: string }>; // ... plus incoming routing parameters

type HealthState = { happiness: number, energy: number, mood: number, hunger: number }

class FetchSuccessRecords extends React.Component<SuccessInTwoMinutesProps, { text: string, healthState: HealthState }> {
	constructor(ps: SuccessInTwoMinutesProps) {
		super();
		this.state = {
			text: '',
			healthState: { happiness: 5, energy: 5, mood: 5, hunger: 5 }
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
	}

	public render() {
		return <div>
			<h1>Success in 2 minutes</h1>
			<p>This component contains success records and you can manipulate them.</p>
			{this.renderForecastsTable()}
			{this.renderPagination()}
			{this.renderInputField()}
			{this.renderSpoiler()}
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
							<button className='btn btn-default' onClick={() => this.props.removeRecord(successRecord)}>Remove</button>
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
		this.setState({
			text: ''
		});
	}

	onSuccessTextInput(event: React.ChangeEvent<HTMLInputElement>) {
		this.setState({
			text: event.target.value
		});
	}

	onHappinessInput(event: React.ChangeEvent<HTMLInputElement>) {
		var currentState = this.state.healthState;
		currentState.happiness = parseInt(event.target.value);
		this.setState({
			healthState: currentState
		});
	}

	onEnergyInput(event: React.ChangeEvent<HTMLInputElement>) {
		var currentState = this.state.healthState;
		currentState.energy = parseInt(event.target.value);
		this.setState({
			healthState: currentState
		});
	}

	onMoodInput(event: React.ChangeEvent<HTMLInputElement>) {
		var currentState = this.state.healthState;
		currentState.mood = parseInt(event.target.value);
		this.setState({
			healthState: currentState
		});
	}

	onHungerInput(event: React.ChangeEvent<HTMLInputElement>) {
		var currentState = this.state.healthState;
		currentState.hunger = parseInt(event.target.value);
		this.setState({
			healthState: currentState
		});
	}

	private renderInputField() {
		return <p className='clearfix text-center'>
			<input type="text" onChange={(event) => this.onSuccessTextInput(event)} value={this.state.text} />
			<button className='btn btn-default' onClick={() => this.onSave()}>Save</button>
		</p>;
	}

	private renderSpoiler() {
		return <div>
			<div className="display-horizontally">
				<p>Happiness</p>
				<input
					type="range"
					className="volume-bar orient-vertical"
					value={this.state.healthState.happiness || 0}
					min="0"
					max="10"
					step="1"
					onChange={(event) => this.onHappinessInput(event)}
				/>
				<div className="current-happiness b">{this.state.healthState.happiness}</div>
			</div>
			<div className="display-horizontally">
				<p>Energy</p>
				<input
					type="range"
					className="volume-bar orient-vertical"
					value={this.state.healthState.energy || 0}
					min="0"
					max="10"
					step="1"
					onChange={(event) => this.onEnergyInput(event)}
				/>
				<div className="current-energy b">{this.state.healthState.energy}</div>
			</div>
			<div className="display-horizontally">
				<p>Mood</p>
				<input
					type="range"
					className="volume-bar orient-vertical"
					value={this.state.healthState.mood || 0}
					min="0"
					max="10"
					step="1"
					onChange={(event) => this.onMoodInput(event)}
				/>
				<div className="current-mood b">{this.state.healthState.mood}</div>
			</div>
			<div className="display-horizontally">
				<p>Hunger</p>
				<input
					type="range"
					className="volume-bar orient-vertical"
					value={this.state.healthState.hunger || 0}
					min="0"
					max="10"
					step="1"
					onChange={(event) => this.onHungerInput(event)}
				/>
				<div className="current-hunger b">{this.state.healthState.hunger}</div>
			</div>

		</div>
	}

    private renderPagination() {
        let prevStartDateIndex = (this.props.startDateIndex || 0) - 10;
        let nextStartDateIndex = (this.props.startDateIndex || 0) + 10;

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
