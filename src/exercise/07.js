// Production performance monitoring
// http://localhost:3000/isolated/exercise/07.js

import * as React from 'react'
import {unstable_trace as trace} from 'scheduler/tracing'
import reportProfile from '../report-profile'

function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () =>
    trace('click', performance.now(), () => setCount(c => c + 1))
  return <button onClick={increment}>{count}</button>
}

function App() {
  return (
    <div>
      <React.Profiler id="counter" onRender={reportProfile}>
        <div>
          Profiled counter
          <Counter />
        </div>
        <div>
          Unprofiled counter
          <Counter />
        </div>
      </React.Profiler>
    </div>
  )
}

export default App

// In review, what we did here was we imported the unstable_trace. We just aliased it to trace because I don't want 
// to type unstable, but this could absolutely change. We're importing that from 'scheduler/tracing'. And then we 
// took this increment, which is the interaction that we wanted to trace.

// We took what we used to have and put it as a third argument. 
// The first argument here for tracing is that identifier for that trace. We can call that whatever we want. When that 
// interaction started, then we have that callback for what we actually want to have happened.

// With that, React will allow us to use this really cool tool for the profile interactions when we are profiling 
// things. We also have access to that in-the-profile information that React calls are onRender function with.