import { useNavigation } from "@react-navigation/native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";

export const useNotifications = () => {
    let token;

    const registerForPushNotificationsAsync = async (alertUser = true) => {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();

            let finalStatus = existingStatus;

            if (existingStatus !== "granted") {
                const { status } = await Notifications.requestPermissionsAsync();
                console.log(status)
                finalStatus = status;
            }

            if (finalStatus !== "granted") {
                if (alertUser) {
                    alert('Failed to get push token for push notification! U need to enable notifications!');
                }
                return null;
            }

            if (Platform.OS === "android") {
                Notifications.setNotificationChannelAsync("default", {
                    name: "default",
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: "#FF231F7C",
                });
            }

            token = (await Notifications.getExpoPushTokenAsync({ projectId: 'de76741c-4591-4365-bec8-ba6a75c0462e' })).data;
            console.log("token", token);
            return token;
        } else {
            alert("Must use physical device for Push Notifications");
            return null;
        }
    };

    // This listener is fired whenever a notification is received while the app is foregrounded
    const handleNotification = (notification) => {
        // could be useful if you want to display your own toast message
        // could also make a server call to refresh data in other part of the app
    };

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    const handleNotificationResponse = (response) => {
        const data = response.notification.request.content.data;
        console.log(data)

        if (data.screen == "main") {
            console.log("dlhaalalal")

        }
        /*         console.log(data)
                if (data?.url) {
                    Linking.openURL(data.url);
                } */
    };

    return {
        registerForPushNotificationsAsync,
        handleNotification,
        handleNotificationResponse,
    };
};
