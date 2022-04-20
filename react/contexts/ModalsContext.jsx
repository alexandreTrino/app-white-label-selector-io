import React from 'react'

export const ModalsContext = React.createContext({})

export default function ModalsProvider(props){

  const [isOpenModalItemPlaced, setOpenModalItemPlaced] = useState(false)
  const [isOpenModalHelper, setOpenModalHelper] = useState(false)
  const [isOpenModalSubscriber, setOpenModalSubscriber] = useState(false)

  return(
      <ModalsContext.Provider value={{
          isOpenModalItemPlaced,
          setOpenModalItemPlaced,
          isOpenModalHelper,
          setOpenModalHelper,
          isOpenModalSubscriber,
          setOpenModalSubscriber
        }}
      >
          {props.children}
      </ModalsContext.Provider>
  )
}
