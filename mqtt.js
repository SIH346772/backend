const { IoTDataPlaneClient, PublishCommand } = require("@aws-sdk/client-iot-data-plane")
const client = new IoTDataPlaneClient({
    region: "ap-south-1",
    credentials: {
        accessKeyId: process.env.MQTT_ACCESS_ID,
        secretAccessKey: process.env.MQTT_ACCESS_KEY
    }
})

/**
 * Publish a message to a topic
 * @param {string} topic 
 * @param {string} payload 
 * @returns {boolean}
 */
async function publishMessageToMQTT(topic, payload) {
    const params = {
        topic: topic,
        payload: payload,
        qos: 1,
        contentType: "application/json"
    }
    const command = new PublishCommand(params)
    try {
        const data = await client.send(command)
        return true
    } catch (err) {
        return false
    }
}


module.exports = { client, publishMessageToMQTT }
