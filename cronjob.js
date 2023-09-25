
  
const { getMessaging } = require("firebase-admin/messaging");


const prisma = require("./db").getInstance();

module.exports = async function(){
    const soilTemperatureThreshold = [10.0, 30.0];
  const soilTLMThreshold = [40.0, 60.0];
  const soilBLMThreshold = [70.0, 90.0];

  const weatherTemperatureThreshold = [0.0, 40.0];
  const humidityThreshold = [30.0, 80.0];

  const toSendSet = new Set();

  const soilData = await prisma.soilData.findMany();

  for (const sd of soilData) {

    const msgdata = {};
    if (sd.temperature < soilTemperatureThreshold[0] || sd.temperature > soilTemperatureThreshold[1]) msgdata.temperature = "Abnormal soil Temperature detected";
    if (sd.topLayerMoisture < soilTLMThreshold[0] || sd.topLayerMoisture > soilTLMThreshold[1]) msgdata.TLM = "Abnormal Top Level Moisture detected";
    if (sd.bottomLayerMoisture < soilBLMThreshold[0] || sd.bottomLayerMoisture > soilBLMThreshold[1]) msgdata.BLM = "Abnormal Bottom Level Moisture detected";

    const sensorProbe = sd.sensorProbe;
    const baseStation = sensorProbe.baseStation;
    const user = baseStation.user;
    const fcmTokens = user.fcmTokens;

    const message = {
      data: msgdata,
      tokens: fcmTokens,
    };

    toSendSet.add(message);
  }

  const localWeatherData = await prisma.localWeatherData.findMany();

  for (const lwd of localWeatherData) {
    const msgdata = {};
    if (lwd.temperature < weatherTemperatureThreshold[0] || lwd.temperature > weatherTemperatureThreshold[1]) msgdata.temperature = "Abnormal Temperature detected";
    if (lwd.humidity < humidityThreshold[0] || lwd.temperature > humidityThreshold[1]) msgdata.humidity = "Abnormal Humidity detected";

    const baseStation = lwd.baseStation;
    const user = baseStation.user;
    const fcmTokens = user.fcmTokens;

    const message = {
      data: msgdata,
      tokens: fcmTokens,
    };

    toSendSet.add(message);
  }


  toSendSet.forEach(function (message) {
    getMessaging().sendMulticast(message)
      .then((response) => {
        console.log(response.successCount + ' messages were sent successfully');
      });
  })
}