// Optimize context value
// http://localhost:3000/isolated/exercise/05.js


// In review, what we did to make this optimization happen is we came up here, and we said, 
// "Hey, we are providing a state and a dispatch. Not all of our components need both of those things, so let's 
// go ahead and split these up into two distinct providers."


// We created a provider for our dispatch, in addition to the provider for our state. We rendered both of those. 
// One taking the state as the value. The other taking the dispatch as the value. 
// We created a special hook for consuming the dispatch.

// Anywhere where we needed the dispatch, we got it from that special hook. Anywhere where we needed the state and 
// the dispatch, we just use both of them. Now, components that are only consuming the dispatch don't need to pay 
// the penalty for when our state is updated.


import * as React from 'react'
import {
  useForceRerender,
  useDebouncedState,
  AppGrid,
  updateGridState,
  updateGridCellState,
} from '../utils'

const AppStateContext = React.createContext()
const AppDispatchContext = React.createContext()

const initialGrid = Array.from({length: 100}, () =>
  Array.from({length: 100}, () => Math.random() * 100),
)

function appReducer(state, action) {
  switch (action.type) {
    case 'TYPED_IN_DOG_INPUT': {
      return {...state, dogName: action.dogName}
    }
    case 'UPDATE_GRID_CELL': {
      return {...state, grid: updateGridCellState(state.grid, action)}
    }
    case 'UPDATE_GRID': {
      return {...state, grid: updateGridState(state.grid)}
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`)
    }
  }
}

function AppProvider({children}) {
  const [state, dispatch] = React.useReducer(appReducer, {
    dogName: '',
    grid: initialGrid,
  })

  return (
    <AppStateContext.Provider value={state}>
    <AppDispatchContext.Provider value={dispatch}>
      {children}
    </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppState() {
  const context = React.useContext(AppStateContext)
  if (!context) {
    throw new Error('useAppState must be used within the AppProvider')
  }
  return context
}

function useAppDispatch() {
  const context = React.useContext(AppDispatchContext)
  if (!context) {
    throw new Error('useAppDispatch must be used within the AppProvider')
  }
  return context
}

function Grid() {
  const dispatch = useAppDispatch()
  const [rows, setRows] = useDebouncedState(50)
  const [columns, setColumns] = useDebouncedState(50)
  const updateGridData = () => dispatch({type: 'UPDATE_GRID'})
  return (
    <AppGrid
      onUpdateGrid={updateGridData}
      rows={rows}
      handleRowsChange={setRows}
      columns={columns}
      handleColumnsChange={setColumns}
      Cell={Cell}
    />
  )
}
Grid = React.memo(Grid)

function Cell({row, column}) {
  const state = useAppState()
  const cell = state.grid[row][column]
  const dispatch = useAppDispatch()
  const handleClick = () => dispatch({type: 'UPDATE_GRID_CELL', row, column})
  return (
    <button
      className="cell"
      onClick={handleClick}
      style={{
        color: cell > 50 ? 'white' : 'black',
        backgroundColor: `rgba(0, 0, 0, ${cell / 100})`,
      }}
    >
      {Math.floor(cell)}
    </button>
  )
}
Cell = React.memo(Cell)

function DogNameInput() {
  const state = useAppState()
  const dispatch = useAppDispatch()
  const {dogName} = state

  function handleChange(event) {
    const newDogName = event.target.value
    dispatch({type: 'TYPED_IN_DOG_INPUT', dogName: newDogName})
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <label htmlFor="dogName">Dog Name</label>
      <input
        value={dogName}
        onChange={handleChange}
        id="dogName"
        placeholder="Toto"
      />
      {dogName ? (
        <div>
          <strong>{dogName}</strong>, I've a feeling we're not in Kansas anymore
        </div>
      ) : null}
    </form>
  )
}

function App() {
  const forceRerender = useForceRerender()
  return (
    <div className="grid-app">
      <button onClick={forceRerender}>force rerender</button>
      <AppProvider>
        <div>
          <DogNameInput />
          <Grid />
        </div>
      </AppProvider>
    </div>
  )
}

export default App

// In review, all that we did here was take that state and dispatch array that we were ascending to the value and 
// we memoized it using react.useMemo. One reason to use useMemo is to save ourselves a bunch of work. 
// The other reason is to give us a stable value.

// You'll read in the docs that React is not a guarantee that this value will always be the same as the last time 
// it was called. Sometimes React may remove that memoized value to free up some memory.

// That's currently not something that is going to happen. Even if that were to happen, the only situation where it 
// would matter would be a situation in which React thinks that doing so will improve performance. You don't really 
// need to worry about that for most cases. In our case, memoizing that context value is giving us a pretty 
// significant savings on re-rendering.

/*
eslint
  no-func-assign: 0,
*/
