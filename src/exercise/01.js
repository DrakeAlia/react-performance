// Code splitting
// http://localhost:3000/isolated/exercise/01.js

import * as React from 'react'


// 🐨 use React.lazy to create a Globe component which uses a dynamic import
// to get the Globe component from the '../globe' module.

const Globe = React.lazy(() => import('../globe'))

function loadGlobe() {
 return import('../globe')
}

function App() {
  const [showGlobe, setShowGlobe] = React.useState(false)

  // 🐨 wrap the code below in a <React.Suspense /> component
  // with a fallback.


  // all that we did here was we added an onMouseEnter and an onFocus to our label, 
  // which to us, is an indication that the user is going to need this code. 
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center',
        height: '100%',
        padding: '2rem',
      }}
    >
      <label style={{marginBottom: '1rem'}} onMouseEnter={loadGlobe} onFocus={loadGlobe}>
        <input
          type="checkbox"
          checked={showGlobe}
          onChange={e => setShowGlobe(e.target.checked)}
        />
        {' show globe'}
      </label>
      <div style={{width: 400, height: 400}}>
      <React.Suspense fallback={<div>Loading...</div>}>
        {showGlobe ? <Globe /> : null}
      </React.Suspense>
      </div>
    </div>
  )
}

// to make this code split, we added a React.lazy right here instead of a direct import for that globe module. 
// As a reminder, that globe module has a default export that is a component.

// It's really important that the default export is a component because that's how React knows what to render when 
// this lazily loaded code is finally loaded. It will only render the default export of the module that we're importing.

// With that in hand, we can now come down here and render that just like it's a regular component. 
// If it had props, we could pass those props just like normal. It would behave, for all intents and purposes, 
// as a regular globe container.

// We put a Suspense boundary around this to specify a fallback UI for what we should show while the user's waiting 
// for that code to load. We're able to lazily load the code for this globe so that users don't have to wait 
// for that entire globe to show up before they can start interacting with our app.

export default App
