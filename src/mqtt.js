// mqtt.js
import mqtt from 'mqtt';

const MQTT_BROKER_URL = 'ws://192.168.1.36:8080';
const MQTT_TOPIC = 'dulieu';

// Hàm để kết nối tới MQTT Broker
export const connectToMQTT = (onMessageReceived) => {
    const client = mqtt.connect(MQTT_BROKER_URL);

    // Xử lý khi kết nối thành công
    client.on('connect', () => {
        console.log('Connected to MQTT Broker');
        client.subscribe(MQTT_TOPIC, (err) => {
            if (!err) {
                console.log(`Subscribed to topic: ${MQTT_TOPIC}`);
            } else {
                console.error('Failed to subscribe:', err);
            }
        });
    });

    // Xử lý khi nhận tin nhắn mới từ broker
    client.on('message', (topic, message) => {
        const payload = message.toString();
        console.log(`Received message on ${topic}: ${payload}`);
        onMessageReceived(payload); // Gọi callback để cập nhật dữ liệu
    });

    // Xử lý khi có lỗi kết nối
    client.on('error', (err) => {
        console.error('Connection error:', err);
    });

    // Đóng kết nối khi không cần thiết
    const disconnect = () => {
        client.end();
        console.log('Disconnected from MQTT Broker');
    };

    return { disconnect };
};
