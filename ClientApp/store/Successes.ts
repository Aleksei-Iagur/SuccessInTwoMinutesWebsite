import { fetch, addTask } from 'domain-task';
import { Action, Reducer, ActionCreator } from 'redux';
import { AppThunkAction } from './';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

export interface SuccessRecordsState {
    isLoading: boolean;
    startDateIndex?: number;
    successRecords: SuccessRecord[];
}

export interface SuccessRecord {
    dateFormatted: string;
    successText: string;
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestSuccessesAction {
    type: 'REQUEST_SUCCESSES';
    startDateIndex: number;
}

interface ReceiveSuccessesAction {
    type: 'RECEIVE_SUCCESSES';
    startDateIndex: number;
    successes: SuccessRecord[];
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestSuccessesAction | ReceiveSuccessesAction;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    requestSucessRecords: (startDateIndex: number): AppThunkAction<KnownAction> => (dispatch, getState) => {
		// Only load data if it's something we don't already have (and are not already loading)
		if (startDateIndex !== getState().successes.startDateIndex) {
			let fetchTask = fetch(`api/SampleData/SuccessRecords?startDateIndex=${ startDateIndex }`)
                .then(response => response.json() as Promise<SuccessRecord[]>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_SUCCESSES', startDateIndex: startDateIndex, successes: data });
                });

            addTask(fetchTask); // Ensure server-side prerendering waits for this to complete
            dispatch({ type: 'REQUEST_SUCCESSES', startDateIndex: startDateIndex });
        }
    }
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: SuccessRecordsState = { successRecords: [], isLoading: false };

export const reducer: Reducer<SuccessRecordsState> = (state: SuccessRecordsState, incomingAction: Action) => {
    const action = incomingAction as KnownAction;
    switch (action.type) {
        case 'REQUEST_SUCCESSES':
            return {
                startDateIndex: action.startDateIndex,
				successRecords: state.successRecords,
                isLoading: true
            };
        case 'RECEIVE_SUCCESSES':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.startDateIndex === state.startDateIndex) {
                return {
                    startDateIndex: action.startDateIndex,
					successRecords: action.successes,
                    isLoading: false
                };
            }
            break;
        default:
            // The following line guarantees that every action in the KnownAction union has been covered by a case above
            const exhaustiveCheck: never = action;
    }

    return state || unloadedState;
};
