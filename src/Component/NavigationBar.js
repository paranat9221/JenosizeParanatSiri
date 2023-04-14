import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import Colors from '../../assets/Colors.json';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons'

class NavigationBarPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showMenu: false
    }
  }

  componentDidMount() {

  }

  render() {
    const { } = this.state
    const { title, navigation } = this.props
    const canGoBack = navigation.canGoBack()

    return (
      <SafeAreaView style={{ ...styles.container, ...styles.shadow }} edges={['top']}>
        <View style={styles.navigationBar}>
          {canGoBack ?
            <TouchableOpacity
              style={styles.sideBtnContainer}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name={'arrow-back'} size={32} />
            </TouchableOpacity>
            :
            <TouchableOpacity
              style={styles.sideBtnContainer}
              disabled
            >
              <Ionicons name={'arrow-back'} size={32} />
            </TouchableOpacity>
          }

          <View style={styles.titleContainer}>
            <Text>{title}</Text>
          </View>
          <TouchableOpacity style={styles.sideBtnContainer} onPress={() => this.setState({ showMenu: true })}>
            <Ionicons name={'ellipsis-vertical'} size={32} />
          </TouchableOpacity>
        </View>

        <Modal
          visible={this.state.showMenu}
          transparent={true}
          onRequestClose={() => this.setState({ showMenu: false })}
          animationType={'fade'}
          statusBarTranslucent
        >
          <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => this.setState({ showMenu: false })}>
            <View />
          </TouchableOpacity>
          <View style={styles.menuModal}>
            <Image style={styles.menuLogo} source={require('../../assets/Image/logo.png')} />
            <Text numberOfLines={1} adjustsFontSizeToFit style={styles.textDetail}>Application created by: Paranat Sirisoonthornwong</Text>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white
  },
  navigationBar: {
    height: 64,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  sideBtnContainer: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalOverlay: {
    backgroundColor: '#000000dd',
    width: '100%',
    height: '100%'
  },
  menuModal: {
    backgroundColor: Colors.white,
    width: '80%',
    position: 'absolute',
    alignSelf: 'center',
    marginTop: 128,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  textDetail: {
    textAlign: 'center'
  },
  menuLogo: {
    width: '100%',
    resizeMode: 'contain'
  },
  shadow: {
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default NavigationBarPage;
