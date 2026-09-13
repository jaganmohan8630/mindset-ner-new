package com.mindsetner.app;

import android.Manifest;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.webkit.PermissionRequest;
import android.webkit.GeolocationPermissions;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebChromeClient;

import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    private static final int MIC_PERMISSION_REQUEST = 1001;
    private static final int LOCATION_PERMISSION_REQUEST = 1002;
    private static final int CAMERA_PERMISSION_REQUEST = 1003;
    private GeolocationPermissions.Callback pendingGeolocationCallback;
    private String pendingGeolocationOrigin;
    private PermissionRequest pendingCameraRequest;
    private PermissionRequest pendingAudioRequest;

    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(MicrophonePermissionPlugin.class);
        registerPlugin(NativeAudioRecorderPlugin.class);
        super.onCreate(savedInstanceState);

        WebView webView = getBridge().getWebView();

        WebSettings settings = webView.getSettings();
        settings.setMixedContentMode(
            WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
        );

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onGeolocationPermissionsShowPrompt(
                    String origin,
                    GeolocationPermissions.Callback callback
            ) {
                boolean hasFineLocation = ContextCompat.checkSelfPermission(
                        MainActivity.this,
                        Manifest.permission.ACCESS_FINE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED;
                boolean hasCoarseLocation = ContextCompat.checkSelfPermission(
                        MainActivity.this,
                        Manifest.permission.ACCESS_COARSE_LOCATION
                ) == PackageManager.PERMISSION_GRANTED;

                if (hasFineLocation || hasCoarseLocation) {
                    callback.invoke(origin, true, false);
                    return;
                }

                pendingGeolocationCallback = callback;
                pendingGeolocationOrigin = origin;
                ActivityCompat.requestPermissions(
                        MainActivity.this,
                        new String[]{
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.ACCESS_COARSE_LOCATION
                        },
                        LOCATION_PERMISSION_REQUEST
                );
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {

                runOnUiThread(() -> {

                    for (String resource : request.getResources()) {
                        if (PermissionRequest.RESOURCE_VIDEO_CAPTURE.equals(resource)) {
                            if (ContextCompat.checkSelfPermission(
                                    MainActivity.this,
                                    Manifest.permission.CAMERA
                            ) == PackageManager.PERMISSION_GRANTED) {
                                request.grant(new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE});
                                return;
                            }

                            pendingCameraRequest = request;
                            ActivityCompat.requestPermissions(
                                    MainActivity.this,
                                    new String[]{Manifest.permission.CAMERA},
                                    CAMERA_PERMISSION_REQUEST
                            );
                            return;
                        }
                    }

                    if (ContextCompat.checkSelfPermission(
                            MainActivity.this,
                            Manifest.permission.RECORD_AUDIO
                    ) != PackageManager.PERMISSION_GRANTED) {
                        // Android permission and WebView permission are two
                        // separate grants. Keep this request so the WebView
                        // can be granted audio capture after the user accepts.
                        pendingAudioRequest = request;
                        ActivityCompat.requestPermissions(
                            MainActivity.this,
                            new String[]{Manifest.permission.RECORD_AUDIO},
                            MIC_PERMISSION_REQUEST
                        );

                        return;
                    }

                    request.grant(
                        new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE}
                    );
                });
            }
        });

    }

    @Override
    public void onRequestPermissionsResult(
            int requestCode,
            String[] permissions,
            int[] grantResults
    ) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);

        if (requestCode == CAMERA_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (pendingCameraRequest != null) {
                if (granted) {
                    pendingCameraRequest.grant(
                            new String[]{PermissionRequest.RESOURCE_VIDEO_CAPTURE}
                    );
                } else {
                    pendingCameraRequest.deny();
                }
                pendingCameraRequest = null;
            }
            return;
        }

        if (requestCode == MIC_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0
                    && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (pendingAudioRequest != null) {
                if (granted) {
                    pendingAudioRequest.grant(
                            new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE}
                    );
                } else {
                    pendingAudioRequest.deny();
                }
                pendingAudioRequest = null;
            }
            return;
        }

        if (requestCode != LOCATION_PERMISSION_REQUEST || pendingGeolocationCallback == null) {
            return;
        }

        boolean granted = false;
        for (int result : grantResults) {
            if (result == PackageManager.PERMISSION_GRANTED) {
                granted = true;
                break;
            }
        }

        pendingGeolocationCallback.invoke(pendingGeolocationOrigin, granted, false);
        pendingGeolocationCallback = null;
        pendingGeolocationOrigin = null;
    }
}
