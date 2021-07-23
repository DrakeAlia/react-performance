// Production performance monitoring
// http://localhost:3000/isolated/exercise/07.js

import * as React from 'react'
// 🐨 you're going to need the reportProfile function
import reportProfile from '../report-profile'


function Counter() {
  const [count, setCount] = React.useState(0)
  const increment = () => setCount(c => c + 1)
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

// In review, what we did here was we took our reportProfile() function that we had here, which is adding things to a 
// queue. We passed it along to the onRender method of our React Profiler.

// We gave that an ID to uniquely identify it against other React Profiler components that we have in our application.
// We wrapped this around our application area that we wanted to measure and monitor for production use. We started 
// to observe these reports getting sent off to our backend.