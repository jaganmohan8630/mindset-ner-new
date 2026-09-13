package com.mindsetner.app;

import android.Manifest;

import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/**
 * Requests Android's microphone permission from a deliberate user action.
 * WebView's getUserMedia permission request is handled separately in MainActivity.
 */
@CapacitorPlugin(
        name = "MicrophonePermission",
        permissions = {
                @Permission(alias = "microphone", strings = {Manifest.permission.RECORD_AUDIO})
        }
)
public class MicrophonePermissionPlugin extends Plugin {

    @PluginMethod
    public void request(PluginCall call) {
        if (getPermissionState("microphone") == PermissionState.GRANTED) {
            resolvePermission(call);
            return;
        }
        requestPermissionForAlias("microphone", call, "permissionCallback");
    }

    @PermissionCallback
    private void permissionCallback(PluginCall call) {
        resolvePermission(call);
    }

    private void resolvePermission(PluginCall call) {
        call.resolve(new com.getcapacitor.JSObject()
                .put("microphone", getPermissionState("microphone").toString().toLowerCase()));
    }
}
