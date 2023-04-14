import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Body, Button } from '../Component';

class HomePage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  nav(page) {
    this.props.navigation.navigate(page)
  }

  render() {
    return (
      <Body>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/Image/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            title="ค้นหาร้านอาหาร"
            onPress={() => this.nav('Restaurant')}
          />
          <Button
            title="แผนที่ บริษัท Jenosize"
            onPress={() => this.nav('Map')}
          />
        </View>
      </Body>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  logoContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '60%',
    resizeMode: 'contain'
  }
});

export default HomePage;
