const path = require("path")

require("dotenv").config({
    path: path.resolve(__dirname, "../../.env.dev")     // For development
})

const { SpeechSynthesizer, AudioConfig, SpeechConfig } = require("microsoft-cognitiveservices-speech-sdk")
const fs = require("fs")
const speechConfig = SpeechConfig.fromSubscription(process.env.TTS_TOKEN, process.env.TTS_REGION)
speechConfig.speechSynthesisLanguage = "vi-VN"


async function speak(id, text) {
    return new Promise((res, rej) => {
        let filename = `${id}.wav`
        let filepath = `public/tts/${filename}`
        if (fs.existsSync(filepath)) {
            res(filename)
        } else {
            const audioConfig = AudioConfig.fromAudioFileOutput(filepath)
            const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig)
            synthesizer.speakTextAsync(
                text,
                rep => {
                    synthesizer.close()
                    res(filename)
                },
                err => {
                    synthesizer.close()
                    rej(filename)
                }
            )
        }
    })
}


module.exports = { speak }