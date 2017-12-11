// @flow
import React, { Component } from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native-web'
import { onSetWsUrl } from '../data/Electron'

import Icon from './Icon'
import Text from './Text'
import TextInput from './Form/TextInput'
import Button from './Form/Button'
import CertSelectionModal from './CertSelectionModal'
import MainframeBar, { FOOTER_SIZE } from './MainframeBar'

import COLORS from '../colors'
import { BASIC_SPACING } from '../styles'

type Props = {
  defaultLocalhostUrl: string,
  storedServerUrl: string,
  connectionError: string,
}

type State = {
  url: ?string,
  showCertsSelectModal?: boolean,
}

export default class NodeConnectionView extends Component {
  state: State = {
    url: '',
  }
  
  constructor(props: Props) {
    super(props)
    this.state = {
      url: props.storedServerUrl,
    }
  }

  onChangeUrl = (value: string) => {
    this.setState({
      url: value,
    })
  }

  onPressConnect = () => {
    const { url } = this.state
    if (url && url.length) {
      const secure = url.split('://')[0] === 'wss'
      if (secure) {
        this.setState({
          showCertsSelectModal: true,
        })
      } else {
        onSetWsUrl(url)
      }
    }
  }

  onPressConnectDefault = () => {
    onSetWsUrl('local')
  }
  
  onCopiedCerts = () => {
    onSetWsUrl(this.state.url)
  }
  
  onRequestClose = () => {
    this.setState({
      showCertsSelectModal: false,
    })
  }

  render() {
    const connectionErrorMessage = this.props.connectionError ? (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{this.props.connectionError}</Text>
      </View>
    ) : null
    
    const certSelectionModal = this.state.showCertsSelectModal ? (
      <CertSelectionModal
        onRequestClose={this.onRequestClose}
        onCopiedCerts={this.onCopiedCerts}
      />
    ) : null

    return (
      <View style={styles.outer}>
        {connectionErrorMessage}
        <View style={styles.container}>
          {certSelectionModal}
          <View style={styles.innerContainer}>
            <View style={styles.icon}>
              <Icon name="mainframe-icon" />
            </View>
            <TouchableOpacity
              onPress={this.onPressConnectDefault}
              style={styles.defaultNodeButton}
            >
              <View style={styles.buttonText}>
                <Text style={styles.defaultNodeButtonTitle}>
                  Start local onyx server
                </Text>
              </View>
              <Icon name="arrow-right" />
            </TouchableOpacity>
            <View style={styles.separator}>
              <View style={[styles.separatorLine, styles.lineLeft]} />
              <Text style={styles.separatorLabel}>OR</Text>
              <View style={[styles.separatorLine, styles.lineRight]} />
            </View>
            <TextInput
              white
              value={this.state.url}
              placeholder="Onyx server websocket url"
              onChangeText={this.onChangeUrl}
            />
            <Button outlineStyle title="Connect to remote server" onPress={this.onPressConnect} />
          </View>
          <MainframeBar footer />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  outer: {
    flex: 1,
    backgroundColor: COLORS.LIGHT_GRAY,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GRAY,
    paddingBottom: FOOTER_SIZE,
  },
  innerContainer: {
    width: 320,
  },
  icon: {
    marginBottom: BASIC_SPACING * 4,
  },
  defaultNodeButton: {
    height: 50,
    borderRadius: 25,
    marginBottom: BASIC_SPACING,
    backgroundColor: COLORS.PRIMARY_RED,
    paddingHorizontal: BASIC_SPACING * 2,
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'space-between',
  },
  buttonText: {
    flexDirection: 'column',
  },
  defaultNodeButtonTitle: {
    color: COLORS.WHITE,
    fontSize: 14,
    fontWeight: 'bold',
  },
  defaultNodeButtonSubtitle: {
    color: COLORS.WHITE,
    fontSize: 11,
  },
  separatorLabel: {
    fontSize: 11,
    color: COLORS.GRAY_47,
    marginHorizontal: BASIC_SPACING,
  },
  separator: {
    marginVertical: BASIC_SPACING * 1.5,
    flexDirection: 'row',
  },
  separatorLine: {
    flex: 1,
    height: 1,
    marginTop: 8,
    backgroundColor: COLORS.GRAY_D3,
    alignSelf: 'stretch',
  },
  lineLeft: {
    marginLeft: 50,
  },
  lineRight: {
    marginRight: 50,
  },
  errorContainer: {
    margin: BASIC_SPACING,
    padding: BASIC_SPACING,
    backgroundColor: COLORS.GRAY_E6,
  },
  errorText: {
    fontSize: 13,
    textAlign: 'center',
  },
})
