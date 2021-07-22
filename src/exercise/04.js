// Window large lists with react-virtual
// http://localhost:3000/isolated/exercise/04.js

import * as React from 'react'
// 🐨 import the useVirtual hook from react-virtual (X)
import {useVirtual} from 'react-virtual'
import {useCombobox} from '../use-combobox'
import {getItems} from '../workerized-filter-cities'
import {useAsync, useForceRerender} from '../utils'

// 💰 I made this for you, you'll need it later:
const getVirtualRowStyles = ({size, start}) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: size,
  transform: `translateY(${start}px)`,
})

function Menu({
  items,
  getMenuProps,
  getItemProps,
  highlightedIndex,
  selectedItem,
  // 🐨 accept listRef, virtualRows, totalHeight (X)
  listRef,
  virtualRows,
  totalHeight,
}) {
  return (
    // 🐨 pass the listRef to the `getMenuProps` prop getter function below: (X)
    <ul {...getMenuProps({ref: listRef})}>
      <li style={{height: totalHeight}} />
      {virtualRows.map(({index, size, start}) => {
        const item = items[index]
        return (
        <ListItem
          key={item.id}
          getItemProps={getItemProps}
          item={item}
          index={index}
          isSelected={selectedItem?.id === item.id}
          isHighlighted={highlightedIndex === index}
          // 🐨 pass a style prop, you can get the inline styles from getVirtualRowStyles()
          // make sure to pass an object with the size (the height of the row)
          // and start (where the row starts relative to the scrollTop of its container). (X)
          style={getVirtualRowStyles({size, start})}
        >
          {item.name}
        </ListItem>
        )
      })}
    </ul>
  )
}

function ListItem({
  getItemProps,
  item,
  index,
  isHighlighted,
  isSelected,
  // 🐨 accept the style prop (X)
  style,
  ...props
}) {
  return (
    <li
      {...getItemProps({
        index,
        item,
        style: {
          backgroundColor: isHighlighted ? 'lightgray' : 'inherit',
          fontWeight: isSelected ? 'bold' : 'normal',
          // 🐨 spread the incoming styles onto this inline style object (X)
          ...style,
        },
        ...props,
      })}
    />
  )
}

function App() {
  const forceRerender = useForceRerender()
  const [inputValue, setInputValue] = React.useState('')

  const {data: items, run} = useAsync({data: [], status: 'pending'})
  React.useEffect(() => {
    run(getItems(inputValue))
  }, [inputValue, run])

  // 🐨 create a listRef with React.useRef (X)
  // which will be used for the parentRef option you pass to useVirtual
  // and should be applied to the <ul /> for our menu. This is how react-virtual
  // knows how to scroll our items as the user scrolls.
  
  // 🐨 call useVirtual with the following configuration options:
  // - size (the number of items) (X)
  // - parentRef (the listRef you created above) (X)
  // - estimateSize (a memoized callback function that returns the size for each item) (X)
  //   💰 in our case, every item has the same size, so this will do: React.useCallback(() => 20, [])
  // - overscan (the number of additional rows to render outside the scrollable view) (X)
  //   💰 You can play around with that number, but you probably don't need more than 10.
  // 🐨 you can set the return value of your useVirtual call to `rowVirtualizer`

  const listRef = React.useRef()
  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef: listRef,
    estimateSize: React.useCallback(() => 20, []),
    overscan: 10, 
  })

  const {
    selectedItem,
    highlightedIndex,
    getComboboxProps,
    getInputProps,
    getItemProps,
    getLabelProps,
    getMenuProps,
    selectItem,
  } = useCombobox({
    items,
    inputValue,
    onInputValueChange: ({inputValue: newValue}) => setInputValue(newValue),
    onSelectedItemChange: ({selectedItem}) =>
      alert(
        selectedItem
          ? `You selected ${selectedItem.name}`
          : 'Selection Cleared',
      ),
    itemToString: item => (item ? item.name : ''),
    // we want to override Downshift's scrollIntoView functionality because
    // react-virtual will handle scrolling for us: (X)
    // 🐨 set scrollIntoView to a "no-op" function
    // 💰 scrollIntoView: () => {},
    // 🐨 when the highlightedIndex changes, then tell react-virtual to scroll
    // to that index.
    scrollintoView: () => {},
    onHighlightedIndexChange: changes => {
      rowVirtualizer.scrollToIndex(changes.highlightedIndex)
    }
  })

  return (
    <div className="city-app">
      <button onClick={forceRerender}>force rerender</button>
      <div>
        <label {...getLabelProps()}>Find a city</label>
        <div {...getComboboxProps()}>
          <input {...getInputProps({type: 'text'})} />
          <button onClick={() => selectItem(null)} aria-label="toggle menu">
            &#10005;
          </button>
        </div>
        <Menu
          items={items}
          getMenuProps={getMenuProps}
          getItemProps={getItemProps}
          highlightedIndex={highlightedIndex}
          selectedItem={selectedItem}
          // 🐨 pass the following props:
          // listRef: listRef (X)
          listRef={listRef}
          // virtualRows: rowVirtualizer.virtualItems (X)
          virtualRows={rowVirtualizer.virtualItems}
          // totalHeight: rowVirtualizer.totalSize (X)
          totalHeight={rowVirtualizer}
        />
      </div>
    </div>
  )
}

export default App


// In review, what we did here was a lot of working around these two libraries that we have downshift with this 
// useCombobox and React Virtual with this useVirtualHook.

// Ultimately, at the end of the day, what we're doing here is we're letting useVirtual know the size of our list, 
// have access to the scrollable element for our list, know what the size of each one of those elements should be, 
// and know how much after and before our list we should render.

// Then we pass along that information to our menu. Then, our menu rather than rendering each individual item of the 
// list, we're rendering those virtual rows, and then applying some styles to each one of these list items, so that 
// they can be rendered where they should go. Then we also added a little li right here to handle the scrollable size 
// of our list.

/*
eslint
  no-unused-vars: "off",
*/
