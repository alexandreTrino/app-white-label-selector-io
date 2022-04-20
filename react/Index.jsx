import React from "react"

//VTEX Resources
import { canUseDOM } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Spinner } from 'vtex.styleguide'

//local contexts
import ModalsProvider from './contexts/ModalsContext'

//local apps
import App from './components/App'

const Index = (props) => {

  //Local CSS Handles
  const handles = useCssHandles(["wrapperSubscription"])

  return (
    canUseDOM ? (
      <ModalsProvider>
        <App
          modalHelperTitle={props.modalHelperTitle}
          percentOff={props.percentOff}
          noFrequencyText={props.noFrequencyText}
          frequencyList={props.frequencyList}
        />
      </ModalsProvider>
    ) : (
      <div className={`${handles.wrapperSubscription} ${handles.wrapperSubscription}`}>
        <Spinner className={handles.spinner} color="currentColor" size={20} />
      </div>
    )
  )
}

App.defaultProps = {
  modalHelperTitle: "Subscription Store",
  percentOff: 10,
  noFrequencyText: "There is still not purchase day options.",
}

App.schema = {
  title: 'Subscription Modal',
  description: 'For users that wish to subscribe a product',
  type: 'object',
  properties: {
    modalHelperTitle:{
      type: 'string',
      title: 'Modal Helper title',
      default: App.defaultProps.modalHelperTitle
    },
    percentOff: {
      type: 'number',
      title: 'Percent discount',
      default: App.defaultProps.percentOff
    },
    noFrequencyText: {
      title: 'No Frequency items text',
      description: '',
      type: 'string',
      default: App.defaultProps.noFrequencyText,
    },
    frequencyList: {
      title: 'Frequency options',
      description: 'Frequency list options',
      type: 'array',
      items: {
        type: 'object',
        properties: {
          label: {
            title: 'Label',
            description: 'Label of frecuency option that will show for users.',
            type: 'string',
          },
          attachmentLabel: {
            title: 'Attachment label',
            description: 'Attachment label for frecuency option. ex: "2 day" or "2 week" or "2 year" ',
            type: 'string',
          }
        },
      },
    },
  },
}

export default Index
