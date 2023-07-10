import React, { useEffect, useState, useRef } from 'react';
import { View } from 'react-native';
import { HubConnectionBuilder } from '@microsoft/signalr';
import { GiftedChat } from 'react-native-gifted-chat';
import * as SecureStore from 'expo-secure-store';

const ChatScreen = ({ route }) => {
    const receiverId = route.params.receiverId;
    const [messages, setMessages] = useState([]);
    const [senderId, setSenderId] = useState();

    const connectionRef = useRef(null);

    const getData = async (key) => {
        const value = await SecureStore.getItemAsync('user');
        setSenderId(JSON.parse(value).id)
    };

    useEffect(() => {
        getData();
        console.log("receiverId", receiverId)
        console.log("senderId", senderId)

        // Create SignalR connection
        const connection = new HubConnectionBuilder()
            .withUrl('https://f210-102-158-234-161.ngrok-free.app/chathub')
            .build();

        // Set the connection reference
        connectionRef.current = connection;

        // Subscribe to receive chat messages
        connection.on('ReceiveMessage', (messageSenderId, message) => {
            console.log(messageSenderId)
            if (messageSenderId === senderId || messageSenderId === receiverId) {
                const receivedMessage = {
                    _id: new Date().getTime(),
                    text: message,
                    createdAt: new Date(),
                    user: {
                        _id: messageSenderId,
                    },
                };

                setMessages((prevMessages) => GiftedChat.append(prevMessages, receivedMessage));
            }
        });

        // Start the SignalR connection
        connection.start()
            .then(() => {
                console.log('SignalR connected');
            })
            .catch((error) => {
                console.log('SignalR connection error:', error);
            });

        return () => {
            // Clean up the connection when the component unmounts
            connectionRef.current.stop();
        };
    }, [senderId, receiverId]);

    const onSend = (newMessages = []) => {
        const message = newMessages[0].text;
        // Send the message to the SignalR hub
        connectionRef.current.invoke('SendMessage', senderId, receiverId, message);
    };

    return (
        <View style={{ flex: 1 }}>
            <GiftedChat
                messages={messages}
                onSend={onSend}
                user={{
                    _id: senderId,
                }}
            />
        </View>
    );
};

export default ChatScreen;
