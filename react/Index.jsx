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
  const handles = useCssHandles(["subscription__wrapper"])

  return (
    canUseDOM ? (
      <ModalsProvider>
        <App
          percentOff={props.percentOff}
          noFrequencyText={props.noFrequencyText}
          frequencyList={props.frequencyList}
          helperLabel={props.helperLabel}
          isHelperLabel={props.isHelperLabel}
        />
      </ModalsProvider>
    ) : (
      <div className={`${handles.subscription__wrapper}`}>
        <Spinner className={handles.spinner} color="currentColor" size={20} />
      </div>
    )
  )
}

Index.defaultProps = {
  modalHelperTitle: "Subscription Store",
  percentOff: 10,
  noFrequencyText: "There is still not frequency options for purchase.",
  helperLabel: "*Lorem ipsum dolor sit amet consectuener :D* Vivamus id lorem sem. Aliquam ornare ex cursus, quis [bibendum metus](/institucional/?target=_blank).",
  isHelperLabel: true
}

Index.schema = {
  title: 'Subscription Modal',
  description: 'For users that wish to subscribe a product',
  type: 'object',
  properties: {
    percentOff: {
      type: 'number',
      title: 'Percent discount',
      default: Index.defaultProps.percentOff
    },
    noFrequencyText: {
      title: 'No Frequency items text',
      description: '',
      type: 'string',
      default: Index.defaultProps.noFrequencyText,
    },
    helperLabel: {
      title: 'Helper label',
      description: 'Label of helper text below of button (* Markdown language)',
      type: 'string',
      default: Index.defaultProps.helperLabel
    },
    isHelperLabel: {
      title: 'Is Helper label active?',
      description: 'Show or Hide the Helper label',
      type: "boolean",
      enum: [
        true,
        false
      ],
      default:  Index.defaultProps.isHelperLabel
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
