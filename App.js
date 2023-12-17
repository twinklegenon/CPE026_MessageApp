import React from 'react';
import { View, Alert, TouchableHighlight, Image, BackHandler, StyleSheet, ImageBackground } from 'react-native';
import Status from './components/Status';
import MessageList from './components/MessageList';
import Toolbar from "./components/Toolbar";
import { createImageMessage, createLocationMessage, 
  createTextMessage } from './utils/MessageUtils';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';

class App extends React.Component {
  state = {
    messages: [
    ],
    fullscreenImageId: null,
    isInputFocused: false,
  };
  
  handlePressToolbarCamera = async () => {
    const { status } = await
    ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      alert('Camera permission is not granted');
      return;
    }
      
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    console.log("Camera result:", result);
      
    if (!result.cancelled && result.assets && result.assets.length >
    0)
    {
      console.log('Captured image URI:', result.assets[0].uri);
      this.setState({
        messages: [createImageMessage(result.assets[0].uri),
        ...this.state.messages],
      });
    }
  };
  
  handlePressToolbarLocation = async () => {
    const { status } = await
    Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    
    let location = await Location.getCurrentPositionAsync({});
    this.setState({
      messages: [createLocationMessage({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        }), ...this.state.messages],
    });
  };

  componentDidMount() {
    this.subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      const { fullscreenImageId } = this.state;
      if (fullscreenImageId) {
        this.dismissFullscreenImage();
        return true;
      }
      return false;
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
  }

  handlePressMessage = ({ id, type }) => {
    switch (type) {
      case 'text':
        Alert.alert(
          'Delete Message',
          'Are you sure you want to delete this message?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Delete',
              onPress: () => {
                this.deleteMessage(id);
              },
              style: 'destructive',
            },
          ],
          { cancelable: false }
        );
        break;
      case 'image':
        this.setState({ fullscreenImageId: id });
        break;
      default:
        break;
    }
  };

  deleteMessage = (messageId) => {
    const updatedMessages = this.state.messages.filter((message) => 
    message.id !== messageId); this.setState({ messages: updatedMessages });
  };

  dismissFullscreenImage = () => {
    this.setState({ fullscreenImageId: null });
  };

  renderFullscreenImage = () => {
    const { messages, fullscreenImageId } = this.state;
    if (!fullscreenImageId) return null;

    const image = messages.find((message) => message.id === fullscreenImageId);
    if (!image || image.type !== 'image') return null;

    const { uri } = image;
    return (
      <TouchableHighlight style={styles.fullscreenOverlay} onPress={this.dismissFullscreenImage}>
        <Image style={styles.fullscreenImage} source={{ uri }} />
      </TouchableHighlight>
    );
  };

  handleChangeFocus = (isFocused) => {
    this.setState({ isInputFocused: isFocused });
  };
  
  handleSubmit = (text) => {
    const { messages } = this.state;
    this.setState({
      messages: [createTextMessage(text), ...messages],
    });
  };
  
  renderToolbar() {
    const { isInputFocused } = this.state;
    return (
      <View style={styles.toolbar}>
        <Toolbar
          isFocused={isInputFocused}
          onSubmit={this.handleSubmit}
          onChangeFocus={this.handleChangeFocus}
          onPressCamera={this.handlePressToolbarCamera}
          onPressLocation={this.handlePressToolbarLocation}
        />
      </View>
    );
  }

  render() {
    return (
      <ImageBackground source={require('./assets/coffee.jpg')} style={styles.background}>
        <View style={styles.container}>
          <View style={styles.innerContainer}>
            <Status />
            {this.renderFullscreenImage()}
            <MessageList
              messages={this.state.messages}
              onPressMessage={this.handlePressMessage}
            />
            {this.renderToolbar()}
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover', 
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',

  },
  content: {
    flex: 1,
  },
  inputMethodEditor: {
    flex: 1,
  },
  toolbar: {
    backgroundColor: 'transparent',
    width: '100%',
    height: 60,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    zIndex: 1,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});

export default App;