import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert } from 'react-native';
import { Body, Button, NavigationBar } from '../Component';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons'
import Geolocation from '@react-native-community/geolocation';
import Colors from '../../assets/Colors.json'

class Stars extends React.Component {
  render() {
    const { rating = 0 } = this.props
    return (
      <View style={styles.starBox}>
        <Ionicons color={'gold'} name={rating > 0.75 ? 'star' : rating > 0.25 ? 'star-half-sharp' : 'star-outline'} />
        <Ionicons color={'gold'} name={rating > 1.75 ? 'star' : rating > 1.25 ? 'star-half-sharp' : 'star-outline'} />
        <Ionicons color={'gold'} name={rating > 2.75 ? 'star' : rating > 2.25 ? 'star-half-sharp' : 'star-outline'} />
        <Ionicons color={'gold'} name={rating > 3.75 ? 'star' : rating > 3.25 ? 'star-half-sharp' : 'star-outline'} />
        <Ionicons color={'gold'} name={rating > 4.75 ? 'star' : rating > 4.25 ? 'star-half-sharp' : 'star-outline'} />
      </View>
    )
  }
}

class RestaurantList extends React.Component {
  getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    if (lat1 && lon1 && lat2 && lon2) {
      var deg2rad = deg => {
        return deg * (Math.PI / 180);
      };
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2 - lat1); // deg2rad below
      var dLon = deg2rad(lon2 - lon1);
      var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      var d = R * c; // Distance in km
      return d.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' km';
    }
    else {
      return ''
    }
  };

  render() {
    const { restaurant, currentLocation } = this.props
    const apiKey = 'AIzaSyA0lHDsdZlV6LFVcMutWZagF7bE6lyF6-Q'

    return (
      <TouchableOpacity
        style={{ ...styles.restaurantListBox, ...styles.shadow }}
        onPress={() => Alert.alert(`see more about: ${restaurant.name}`)}
      >
        <View style={{ ...styles.restaurantListPhotoBox, ...styles.shadow }}>
          {restaurant.photos?.[0]?.photo_reference ?
            <Image
              source={{ uri: `https://maps.googleapis.com/maps/api/place/photo?key=${apiKey}&photoreference=${restaurant.photos?.[0]?.photo_reference}&maxwidth=100` }}
              style={styles.restaurantListPhoto}
            />
            :
            <Image
              source={require('../../assets/Image/logo.png')}
              style={styles.restaurantListPhotoThumbnail}
            />
          }
        </View>
        <View style={styles.restaurantListDetail}>
          <View style={styles.restaurantListDetailMain}>
            <Text numberOfLines={2} adjustsFontSizeToFit style={styles.restaurantName}>{restaurant.name}</Text>
            <View style={styles.restaurantListRatingBox}>
              <Text>{restaurant.rating}</Text>
              <Stars rating={restaurant.rating} />
              <Text>({restaurant.user_ratings_total})</Text>
            </View>
          </View>
          <View style={styles.restaurantListDetailMore}>
            <View style={styles.restaurantListDistance}>
              <Text>{(this.getDistanceFromLatLonInKm(currentLocation.latitude, currentLocation.longitude, restaurant.geometry.location.lat, restaurant.geometry.location.lng))}</Text>
            </View>
            {typeof restaurant.opening_hours?.open_now == 'boolean' ?
              restaurant.opening_hours?.open_now ?
                <View style={styles.restaurantListOpenStatusBox}>
                  <Ionicons name={'ellipse'} color={'green'} />
                  <Text style={{ color: 'green' }}>open now</Text>
                </View>
                :
                <View style={styles.restaurantListOpenStatusBox}>
                  <Ionicons name={'ellipse'} color={Colors.gray} />
                  <Text style={styles.hintText}>closed</Text>
                </View>
              :
              <View />
            }
          </View>
        </View>
      </TouchableOpacity >
    )
  }
}

class RestaurantPage extends React.Component {
  constructor(props) {
    super(props)
    this.apiKey = 'AIzaSyA0lHDsdZlV6LFVcMutWZagF7bE6lyF6-Q'
    this.state = {
      isLoading: false,
      isFetchingMore: false,
      searchText: '',
      datas: [],
      currentLocation: {},
      isEndOfData: false,
      searchHistory: []
    }
  }

  async componentDidMount() {
    Geolocation.getCurrentPosition(info => {
      this.setState({ currentLocation: info.coords })
    });

    let searchHistory = await AsyncStorage.getItem('searchHistory')
    searchHistory = JSON.parse(searchHistory) || []
    this.setState({ searchHistory })
  }

  async getLatestSearch() {
    const latestData = await AsyncStorage.getItem('latestRestaurantList')
    return JSON.parse(latestData)
  }
  setLatestSearch(datas) {
    AsyncStorage.setItem('latestRestaurantList', JSON.stringify(datas))
  }

  search() {
    this.updateSearchHistory(this.state.searchText)
    this.setState({ datas: [], isLoading: true, isFetchingMore: false, isEndOfData: false })
    const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${this.apiKey}&query=${this.state.searchText}&type=restaurant`;
    fetch(url)
      .then(res => res.json())
      .then(resjson => {
        if (resjson.status == 'OK') {
          const payload = resjson.results
          this.setState({ datas: payload, isLoading: false, latestResult: resjson, isEndOfData: !resjson.next_page_token })
          this.setLatestSearch(payload)
        }
      })
      .catch(err => {
        this.setState({ isLoading: false })
        console.warn(err)
      })
  }
  fetchMore() {
    if (this.state.latestResult?.next_page_token && !this.state.isFetchingMore) {
      this.setState({ isFetchingMore: true })
      const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?key=${this.apiKey}&pagetoken=${this.state.latestResult.next_page_token}`;
      fetch(url)
        .then(res => res.json())
        .then(resjson => {
          if (resjson.status == 'OK') {
            const payload = resjson.results
            this.setState({ datas: [...this.state.datas, ...payload], isFetchingMore: false, latestResult: resjson, isEndOfData: !resjson.next_page_token })
            this.setLatestSearch(payload)
          }
        })
        .catch(err => {
          this.setState({ isFetchingMore: false })
          console.warn(err)
        })
    }
  }

  async updateSearchHistory(text) {
    let searchHistory = await AsyncStorage.getItem('searchHistory')
    searchHistory = JSON.parse(searchHistory) || []
    const prevIndex = searchHistory.findIndex(e => { return e == text })
    if (prevIndex > -1) {
      searchHistory.splice(prevIndex, 1)
    }
    searchHistory.unshift(text)
    AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory.slice(0, 5)))
  }
  async removeSearchHistoryByText(text) {
    let searchHistory = await AsyncStorage.getItem('searchHistory')
    searchHistory = JSON.parse(searchHistory) || []
    const prevIndex = searchHistory.findIndex(e => { return e == text })
    if (prevIndex > -1) {
      searchHistory.splice(prevIndex, 1)
    }
    this.setState({ searchHistory })
    AsyncStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }

  render() {
    return (
      <Body>
        <NavigationBar {...this.props} title={'Restaurants'} />
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            ListHeaderComponent={
              <View>
                <View activeOpacity={1} style={{ ...styles.searchBox, ...styles.shadow }} onPress={() => this.searchInputRef.focus()}>
                  <Ionicons color={'gray'} name={'search'} style={styles.searchIcon} />
                  <TextInput
                    placeholder='search'
                    ref={ref => this.searchInputRef = ref}
                    style={styles.searchInput}
                    returnKeyType={'search'}
                    onChangeText={(e) => this.setState({ searchText: e })}
                    value={this.state.searchText}
                    onSubmitEditing={() => this.search()}
                  />
                  <TouchableOpacity style={styles.searchBtn} onPress={() => this.search()}>
                    <Text style={styles.searchBtnText}>Search</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
            ListEmptyComponent={
              <View >
                {this.state.isLoading ?
                  <View style={styles.emptyListBox}>
                    <ActivityIndicator style={styles.activityIndicator} />
                  </View>
                  :
                  Array.isArray(this.state.searchHistory) && this.state.searchHistory.length > 0 ?
                    <View style={styles.searchHistoryBox}>
                      <FlatList
                        data={this.state.searchHistory}
                        keyExtractor={(item, index) => index}
                        ListHeaderComponent={() => {
                          return (
                            <View>
                              <Text style={{ ...styles.hintText, marginVertical: 8 }}>Search history</Text>
                              <View style={styles.separateLine} />
                            </View>
                          )
                        }}
                        ItemSeparatorComponent={() => { return (<View style={styles.separateLine} />) }}
                        ListFooterComponent={() => { return (<View style={styles.separateLine} />) }}
                        renderItem={({ item, index }) => {
                          return (
                            <View style={styles.searchHistoryList}>
                              <TouchableOpacity onPress={() => this.setState({ searchText: item }, () => this.search())}>
                                <Text>{item}</Text>
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => this.removeSearchHistoryByText(item)}>
                                <Ionicons name={'close'} />
                              </TouchableOpacity>
                            </View>
                          )
                        }}
                      />
                    </View>
                    :
                    <View style={styles.emptyListBox}>
                      <View style={styles.descBox}>
                        <Ionicons color={'gray'} name={'search'} style={styles.searchIcon} size={64} />
                        <Text style={styles.hintText}>Restaurant</Text>
                      </View>
                    </View>
                }
              </View>
            }
            data={this.state.datas}
            keyExtractor={(item) => item.reference}
            renderItem={({ item, index }) => {
              return <RestaurantList key={index} restaurant={item} currentLocation={this.state.currentLocation} />
            }}
            ListFooterComponent={
              <View style={styles.listFooterBox}>
                {this.state.isEndOfData ?
                  <View style={styles.endOfDataBox}>
                    <Text style={styles.hintText}>- End of data -</Text>
                  </View>
                  :
                  this.state.isFetchingMore ?
                    <View>
                      <ActivityIndicator style={styles.footerActivityIndicator} />
                    </View>
                    :
                    <View />
                }
              </View>
            }
            onEndReachedThreshold={0.01}
            onEndReached={info => {
              this.fetchMore(info)
            }}
          />
        </View>
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
  restaurantListBox: {
    backgroundColor: Colors.white,
    margin: 8,
    padding: 4,
    borderRadius: 8,
    flexDirection: 'row'
  },
  restaurantName: {
    fontWeight: 'bold',
    color: Colors.blue
  },
  restaurantListDetail: {
    flex: 1,
    marginHorizontal: 8,
  },
  restaurantListDetailMain: {
    flex: 1,
  },
  restaurantListDetailMore: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  restaurantListOpenStatusBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  restaurantListDistance: {

  },
  restaurantListPhotoBox: {
    backgroundColor: Colors.white,
    margin: 4,
    borderRadius: 4,
    width: 84,
    height: 84,
    justifyContent: 'center',
    alignItems: 'center'
  },
  restaurantListPhoto: {
    borderRadius: 4,
    width: 84,
    height: 84,
  },
  restaurantListPhotoThumbnail: {
    borderRadius: 4,
    width: 64,
    height: 64,
    resizeMode: 'contain'
  },
  restaurantListRatingBox: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  starBox: {
    flexDirection: 'row',
    marginHorizontal: 2
  },
  searchBox: {
    flexDirection: 'row',
    marginTop: 16,
    marginBottom: 8,
    marginHorizontal: 8,
    backgroundColor: Colors.white,
    borderRadius: 4,
    alignItems: 'center'
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
  },
  searchIcon: {
    marginHorizontal: 8
  },
  searchBtn: {
    marginHorizontal: 8
  },
  searchBtnText: {
    fontWeight: 'bold',
    color: Colors.blue
  },
  emptyListBox: {
    marginTop: 64
  },
  searchHistoryBox: {
    margin: 8,
  },
  activityIndicator: {

  },
  descBox: {
    alignSelf: 'center',
    alignItems: 'center'
  },
  listFooterBox: {
    marginBottom: 64
  },
  endOfDataBox: {
    alignSelf: 'center'
  },
  footerActivityIndicator: {
    margin: 8
  },
  separateLine: {
    height: 1,
    width: '100%',
    backgroundColor: Colors.gray,
    marginVertical: 4
  },
  searchHistoryList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  hintText: {
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

export default RestaurantPage;
