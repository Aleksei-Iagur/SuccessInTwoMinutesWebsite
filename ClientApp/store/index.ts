import * as Counter from './Counter';
import * as Successintwominutes from './Successes';

// The top-level state object
export interface ApplicationState {
	counter: Counter.CounterState;
	successes: Successintwominutes.SuccessRecordsState;
}

// Whenever an action is dispatched, Redux will update each top-level application state property using
// the reducer with the matching name. It's important that the names match exactly, and that the reducer
// acts on the corresponding ApplicationState property type.
export const reducers = {
	counter: Counter.reducer,
	successes: Successintwominutes.reducer
};

// This type can be used as a hint on action creators so that its 'dispatch' and 'getState' params are
// correctly typed to match your store.
export interface AppThunkAction<TAction> {
    (dispatch: (action: TAction) => void, getState: () => ApplicationState): void;
}
