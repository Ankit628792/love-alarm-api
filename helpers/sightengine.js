const axios = require('axios');
var envs = require('../config/env')

const verifyImage = ({ image }) => {
  const queryData = {
    api_user: envs.SIGHTENGINE_API_USER,
    api_secret: envs.SIGHTENGINE_API_SECRET,
    url: image,
    models: 'nudity,scam,face-attributes,text',
  };
  return axios
    .get('https://api.sightengine.com/1.0/check.json', {
      params: queryData,
      // headers: data.getHeaders(),
    }).then(res => res.data).catch(e => console.log(e.message))
};

const sendVerifyResponse = (imageVerify) => {
  let verified = true;
  let extraInfo = {};
  // Face detection
  if (imageVerify && imageVerify.faces) {
    verified = verified && imageVerify.faces.length > 0;
    if (imageVerify.faces.length === 0) {
      verified = false;
      extraInfo.reason = 'No faces detected';
    }
    extraInfo.faceDetected = imageVerify.faces.length;
    imageVerify.faces.map(({ celebrity }) => {
      // console.log(celebrity);
      const matchedCelebrity = celebrity.filter(({ prob }) => prob > 0.9);
      console.log(matchedCelebrity);
      if (matchedCelebrity.length) {
        verified = false;
        extraInfo.reason = 'Please use a non-celebrity picture';
        extraInfo.matchedCelebrityName = matchedCelebrity[0].name;
      }
    })
  }
  if (imageVerify && imageVerify.nudity) {
    if (imageVerify.nudity.safe < 0.8) {
      verified = false;
      extraInfo.reason = 'Nudity detected';
    }
    extraInfo.nuditySafeProbability = imageVerify.nudity.safe;
  }
  if (imageVerify && imageVerify.scam) {
    if (imageVerify.scam.prob > 0.6) {
      verified = false;
      extraInfo.reason = 'Inappropriate image detected';
    }
  }
  if (imageVerify && imageVerify.text) {
    if (imageVerify.text.has_artificial > 0.6) {
      verified = false;
      extraInfo.reason = 'Image contains text';
    }
  }
  return { verified, ...extraInfo };
};

module.exports = {
  verifyImage,
  sendVerifyResponse,
};
