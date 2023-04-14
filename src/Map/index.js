import React from 'react';
import { StyleSheet, View, Image, Linking, Text } from 'react-native';
import { Body, Button, NavigationBar } from '../Component';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../assets/Colors.json';
import AsyncStorage from '@react-native-async-storage/async-storage';

class Main extends React.Component {
  constructor(props) {
    super(props)
    this.jenosizeLat = 13.89399650314388
    this.jenosizeLng = 100.51631815995435
    this.jenosizeGoogleMapUrl = 'https://maps.app.goo.gl/gzbhzwRBVC5a7cCn9'
    this.state = {
      latestAccess: null
    }
  }

  componentDidMount() {
    this.updateLatestAccess()
  }

  async updateLatestAccess() {
    let lastestTime = await AsyncStorage.getItem('latestAccess')
    lastestTime = lastestTime && JSON.parse(lastestTime)
    this.setState({ latestAccess: lastestTime })
    AsyncStorage.setItem('latestAccess', JSON.stringify(Date.now()))
  }
  getDateText(timestamp) {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }

  render() {
    return (
      <Body>
        <NavigationBar {...this.props} title={'Jenosize Location'} />
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../../assets/Image/logo.png')} />
        </View>
        <SafeAreaView style={{ ...styles.mapContainer, ...styles.shadow }} edges={['bottom']}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={{
              latitude: this.jenosizeLat,
              longitude: this.jenosizeLng,
              latitudeDelta: 0.001,
              longitudeDelta: 0.001,
            }}
          >
            <Marker
              coordinate={{
                latitude: this.jenosizeLat,
                longitude: this.jenosizeLng,
              }}
            />
          </MapView>
          <View style={styles.btnContainer}>
            <Button title={'OPEN in Google Maps'} onPress={() => Linking.openURL(this.jenosizeGoogleMapUrl)} />
          </View>
          <View style={styles.latestAccessBox}>
            {this.state.latestAccess &&
              <Text style={styles.latestAccessText}>Latest Access: {this.getDateText(this.state.latestAccess)}</Text>
            }
          </View>
        </SafeAreaView>
      </Body>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.black
  },
  logoContainer: {
    width: '100%',
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  logo: {
    flex: 1,
    resizeMode: 'contain',
  },
  mapContainer: {
    flex: 1,
    margin: 16,
  },
  map: {
    flex: 1
  },
  btnContainer: {
    marginTop: 16
  },
  latestAccessBox: {

  },
  latestAccessText: {
    fontSize: 10,
    textAlign: 'center',
    color: Colors.gray
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

export default Main;
