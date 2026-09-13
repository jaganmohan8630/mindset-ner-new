package com.mindsetner.app;

import android.media.MediaRecorder;
import android.util.Base64;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;

/** Records voice messages natively on Android instead of relying on WebView capture. */
@CapacitorPlugin(name = "NativeAudioRecorder")
public class NativeAudioRecorderPlugin extends Plugin {
    private MediaRecorder recorder;
    private File audioFile;

    @PluginMethod
    public void start(PluginCall call) {
        releaseRecorder();
        try {
            audioFile = File.createTempFile("mindset-ner-voice-", ".m4a", getContext().getCacheDir());
            recorder = new MediaRecorder();
            recorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            recorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            recorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            recorder.setAudioEncodingBitRate(64000);
            recorder.setAudioSamplingRate(44100);
            recorder.setOutputFile(audioFile.getAbsolutePath());
            recorder.prepare();
            recorder.start();
            call.resolve();
        } catch (Exception error) {
            releaseRecorder();
            deleteAudioFile();
            call.reject("Unable to start Android voice recording: " + error.getMessage());
        }
    }

    @PluginMethod
    public void stop(PluginCall call) {
        if (recorder == null || audioFile == null) {
            call.reject("No voice recording is in progress.");
            return;
        }

        try {
            recorder.stop();
            recorder.reset();
            recorder.release();
            recorder = null;

            String audioBase64 = readFileAsBase64(audioFile);
            deleteAudioFile();
            JSObject result = new JSObject();
            result.put("base64", audioBase64);
            result.put("mimeType", "audio/mp4");
            result.put("fileName", "voice-message.m4a");
            call.resolve(result);
        } catch (Exception error) {
            releaseRecorder();
            deleteAudioFile();
            call.reject("Unable to save voice recording. Please record for at least one second and try again.");
        }
    }

    @PluginMethod
    public void cancel(PluginCall call) {
        releaseRecorder();
        deleteAudioFile();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        releaseRecorder();
        deleteAudioFile();
        super.handleOnDestroy();
    }

    private String readFileAsBase64(File file) throws IOException {
        byte[] bytes = new byte[(int) file.length()];
        try (FileInputStream input = new FileInputStream(file)) {
            int offset = 0;
            while (offset < bytes.length) {
                int read = input.read(bytes, offset, bytes.length - offset);
                if (read < 0) break;
                offset += read;
            }
        }
        return Base64.encodeToString(bytes, Base64.NO_WRAP);
    }

    private void releaseRecorder() {
        if (recorder == null) return;
        try { recorder.reset(); } catch (Exception ignored) { }
        try { recorder.release(); } catch (Exception ignored) { }
        recorder = null;
    }

    private void deleteAudioFile() {
        if (audioFile != null && audioFile.exists()) audioFile.delete();
        audioFile = null;
    }
}
