import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from '../../assets/Colors.json'

class Body extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        return (
            <View style={styles.container}>
                {this.props.children}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor
    }
});

export default Body;
