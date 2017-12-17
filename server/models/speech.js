'use strict';

module.exports = function(Speech) {
  // remote method
  Speech.speech = function(audioBytes, cb) {
    // Imports the Google Cloud client library
  const speech = require('@google-cloud/speech');

  // Your Google Cloud Platform project ID
  const projectId = 'trendandbeach-prime';

  // Creates a client
  const client = new speech.SpeechClient({
    projectId: projectId,
  });

  // The audio file's encoding, sample rate in hertz, and BCP-47 language code
  const audio = {
    content: audioBytes,
  };

  // @todo: by config or detect automatically
  // @todo: switch to OGG!
  const config = {
    encoding: 'LINEAR16',
    sampleRateHertz: 44100,
    languageCode: 'de-DE',
  };
  const request = {
    audio: audio,
    config: config,
  };

  // Detects speech in the audio file
  client
    .recognize(request)
    .then(data => {
      const response = data[0];
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        //  @todo: better alternatives handling
        .join('\n');
      cb(null, transcription);
    })
    .catch(err => {
      // @todo: better error handling
      console.error('ERROR:', err);
      cb(null, err);
    });
  };

  Speech.remoteMethod(
    'speech',
    {
      accepts: [{arg: 'audioBytes', type: 'string'}],
      returns: {arg: 'transcription', type: 'string'},
      http: {path:'/speech', verb: 'post'}
    }
  );
};
