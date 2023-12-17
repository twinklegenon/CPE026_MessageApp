import {StyleSheet, TextInput, Image,
    TouchableOpacity, View} from "react-native";
import PropTypes from "prop-types";
import React from "react";
import cam from "../assets/capture.png";
import loc from "../assets/place.png";


const ToolbarButton = ({ iconSource, onPress }) => (
    <TouchableOpacity onPress={onPress}>
        <Image source={iconSource} style={styles.icon} />
    </TouchableOpacity>
);

ToolbarButton.propTypes = {
    iconSource: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
};
    

export default class Toolbar extends React.Component {
    static propTypes = {
        isFocused: PropTypes.bool.isRequired,
        onChangeFocus: PropTypes.func,
        onSubmit: PropTypes.func,
        onPressCamera: PropTypes.func,
        onPressLocation: PropTypes.func,
    };
    
    static defaultProps = {
        onChangeFocus: () => {},
        onSubmit: () => {},
        onPressCamera: () => {},
        onPressLocation: () => {},
    };

    state = {
        text: "",
    };

    handleChangeText = (text) => {
        this.setState({ text });
    };

    handleSubmitEditing = () => {
        const { onSubmit } = this.props;
        const { text } = this.state;
        if (!text) return;
        onSubmit(text);
        this.setState({ text: "" });
    };

    setInputRef = (ref) => {
        this.input = ref;
    };
    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
          if (this.props.isFocused) {
            this.input.focus();
          } else {
            this.input.blur();
          }
        }
      }

    handleFocus = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(true);
    };

    handleBlur = () => {
        const { onChangeFocus } = this.props;
        onChangeFocus(false);
    };
        
        
    render() {
        const { onPressCamera, onPressLocation } = this.props;
        const { text } = this.state;
        return (
            <View style={styles.toolbar}>
                {/* Use emojis for icons instead! */}
                <ToolbarButton iconSource={cam} onPress={onPressCamera} />
                <ToolbarButton iconSource={loc} onPress={onPressLocation} />
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        underlineColorAndroid={"transparent"}
                        placeholder={"Enter you message"}
                        blurOnSubmit={false}
                        value={text}
                        onChangeText={this.handleChangeText}
                        onSubmitEditing={this.handleSubmitEditing}
                        ref={this.setInputRef}
                        onFocus={this.handleFocus}
                        onBlur={this.handleBlur}
                    />
                </View>
            </View>
        );
    }      
}

const styles = StyleSheet.create({
    toolbar: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 10,
        paddingLeft: 0,
        backgroundColor: 'transparent',
    },
    icon: {
        width: 40, 
        height: 40,
        margin: 3,
    },
    inputContainer: {
        flex: 1,
        flexDirection: "row",
        borderWidth: 3,
        borderColor: "#101010",
        borderRadius: 16,
        paddingVertical: 4,
        paddingHorizontal: 12,
        backgroundColor: "#ECEBEB",
        },
    input: {
        flex: 1,
        fontSize: 18,
    },
})
