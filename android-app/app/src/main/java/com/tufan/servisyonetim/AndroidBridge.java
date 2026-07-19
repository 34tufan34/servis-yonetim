package com.tufan.servisyonetim;

import android.content.ContentResolver;
import android.content.ContentValues;
import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.MediaStore;
import android.provider.Settings;
import android.util.Base64;
import android.webkit.JavascriptInterface;
import android.widget.Toast;

import androidx.core.content.FileProvider;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import org.json.JSONObject;

public final class AndroidBridge {
    private final MainActivity activity;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    AndroidBridge(MainActivity activity) {
        this.activity = activity;
    }

    @JavascriptInterface
    public String getApkVersion() {
        return AppConfig.APK_VERSION;
    }

    @JavascriptInterface
    public String getWebVersion() {
        return AppConfig.WEB_VERSION;
    }

    @JavascriptInterface
    public void printCurrentPage(String jobName) {
        activity.printCurrentPage(jobName);
    }

    @JavascriptInterface
    public void startVoiceRecognition(String prompt) {
        activity.startVoiceRecognition(prompt);
    }

    /**
     * Uygulama verileri silinse bile aynı Android cihazında değişmeyen lisans kimliği.
     * ANDROID_ID, aynı imza anahtarı ve Android kullanıcı profili için kararlıdır.
     */
    @JavascriptInterface
    public String getStableDeviceId() {
        try {
            String androidId = Settings.Secure.getString(
                    activity.getContentResolver(),
                    Settings.Secure.ANDROID_ID
            );
            if (androidId == null || androidId.trim().isEmpty()) return "";
            String source = activity.getPackageName() + "|" + androidId.trim();
            return "SYS-AND-" + sha256Hex(source).substring(0, 32).toUpperCase(Locale.ROOT);
        } catch (Exception error) {
            return "";
        }
    }

    /**
     * Geriye dönük uyumluluk için senkron lisans isteği.
     * Yeni web sürümü requestLicenseAsync metodunu kullanır.
     */
    @JavascriptInterface
    public String requestLicense(String path, String jsonPayload) {
        return performLicenseRequest(path, jsonPayload);
    }

    /**
     * Lisans isteğini arka planda çalıştırır. Böylece WebView JavaScript'i ve
     * açılış ekranı ağ isteği boyunca kilitlenmez.
     */
    @JavascriptInterface
    public void requestLicenseAsync(String requestId, String path, String jsonPayload) {
        final String safeRequestId = requestId == null ? "" : requestId.trim();
        if (safeRequestId.isEmpty() || safeRequestId.length() > 120) return;

        executor.execute(() -> {
            String envelope = performLicenseRequest(path, jsonPayload);
            String script = "(function(){if(window.__servisResolveNativeLicenseRequest){"
                    + "window.__servisResolveNativeLicenseRequest("
                    + JSONObject.quote(safeRequestId) + ","
                    + JSONObject.quote(envelope)
                    + ");}})();";
            activity.evaluateJavascript(script);
        });
    }

    private String performLicenseRequest(String path, String jsonPayload) {
        JSONObject result = new JSONObject();
        HttpURLConnection connection = null;

        try {
            if (!"/activate".equals(path) && !"/validate".equals(path)) {
                throw new IllegalArgumentException("Geçersiz servis adresi");
            }

            String payloadText = jsonPayload == null ? "{}" : jsonPayload;
            if (payloadText.length() > 4096) {
                throw new IllegalArgumentException("Servis isteği çok büyük");
            }

            URL url = new URL(AppConfig.LICENSE_API_URL + path);
            connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(7000);
            connection.setReadTimeout(7000);
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setUseCaches(false);
            connection.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("User-Agent", "ServisYonetimAPK/" + AppConfig.APK_VERSION);

            byte[] payload = payloadText.getBytes(StandardCharsets.UTF_8);
            connection.setFixedLengthStreamingMode(payload.length);
            try (OutputStream output = connection.getOutputStream()) {
                output.write(payload);
            }

            int status = connection.getResponseCode();
            InputStream input = status >= 200 && status < 400
                    ? connection.getInputStream()
                    : connection.getErrorStream();

            result.put("transportOk", true);
            result.put("status", status);
            result.put("body", readText(input));
        } catch (Exception error) {
            try {
                result.put("transportOk", false);
                result.put("status", 0);
                result.put("message", error.getMessage() == null
                        ? "Lisans sunucusuna ulaşılamadı."
                        : error.getMessage());
            } catch (Exception ignored) {
                return "{\"transportOk\":false,\"status\":0,\"message\":\"Lisans sunucusuna ulaşılamadı.\"}";
            }
        } finally {
            if (connection != null) connection.disconnect();
        }

        return result.toString();
    }

    /**
     * WebView file:// kökeninden doğrudan GitHub JSON fetch isteği engellenebildiği için
     * yakıt fiyatını Android ağ katmanından arka planda okur.
     */
    @JavascriptInterface
    public void requestFuelPricesAsync(String requestId) {
        final String safeRequestId = requestId == null ? "" : requestId.trim();
        if (safeRequestId.isEmpty() || safeRequestId.length() > 120) return;

        executor.execute(() -> {
            String envelope = performFuelPricesRequest();
            String script = "(function(){if(window.__servisResolveNativeFuelRequest){"
                    + "window.__servisResolveNativeFuelRequest("
                    + JSONObject.quote(safeRequestId) + ","
                    + JSONObject.quote(envelope)
                    + ");}})();";
            activity.evaluateJavascript(script);
        });
    }

    private String performFuelPricesRequest() {
        JSONObject result = new JSONObject();
        HttpURLConnection connection = null;

        try {
            URL url = new URL(AppConfig.FUEL_PRICES_URL + "?_fuel=" + System.currentTimeMillis());
            connection = (HttpURLConnection) url.openConnection();
            connection.setConnectTimeout(8000);
            connection.setReadTimeout(8000);
            connection.setRequestMethod("GET");
            connection.setUseCaches(false);
            connection.setRequestProperty("Accept", "application/json");
            connection.setRequestProperty("Cache-Control", "no-cache");
            connection.setRequestProperty("Pragma", "no-cache");
            connection.setRequestProperty("User-Agent", "ServisYonetimAPK/" + AppConfig.APK_VERSION);

            int status = connection.getResponseCode();
            InputStream input = status >= 200 && status < 400
                    ? connection.getInputStream()
                    : connection.getErrorStream();

            result.put("transportOk", true);
            result.put("status", status);
            result.put("body", readText(input));
            result.put("sourceUrl", AppConfig.FUEL_PRICES_URL);
        } catch (Exception error) {
            try {
                result.put("transportOk", false);
                result.put("status", 0);
                result.put("message", error.getMessage() == null
                        ? "Motorin fiyat kaynağına ulaşılamadı."
                        : error.getMessage());
            } catch (Exception ignored) {
                return "{\"transportOk\":false,\"status\":0,\"message\":\"Motorin fiyat kaynağına ulaşılamadı.\"}";
            }
        } finally {
            if (connection != null) connection.disconnect();
        }

        return result.toString();
    }

    @JavascriptInterface
    public void shareText(String title, String text, String url) {
        activity.runOnUiThread(() -> {
            try {
                Intent intent = new Intent(Intent.ACTION_SEND);
                intent.setType("text/plain");
                StringBuilder body = new StringBuilder();
                if (text != null && !text.trim().isEmpty()) body.append(text.trim());
                if (url != null && !url.trim().isEmpty()) {
                    if (body.length() > 0) body.append("\n");
                    body.append(url.trim());
                }
                intent.putExtra(Intent.EXTRA_TEXT, body.toString());
                if (title != null && !title.trim().isEmpty()) {
                    intent.putExtra(Intent.EXTRA_SUBJECT, title.trim());
                }
                activity.startActivity(Intent.createChooser(intent, "Paylaş"));
            } catch (Exception error) {
                toast("Paylaşım açılamadı.");
            }
        });
    }

    @JavascriptInterface
    public void shareFile(String dataUrl, String fileName, String mimeType, String title, String text) {
        executor.execute(() -> {
            try {
                byte[] bytes = decodeDataUrl(dataUrl);
                String safeName = safeFileName(fileName, mimeType);
                File dir = new File(activity.getCacheDir(), "shared");
                if (!dir.exists() && !dir.mkdirs()) {
                    throw new IllegalStateException("Paylaşım klasörü oluşturulamadı");
                }
                File file = new File(dir, safeName);
                try (FileOutputStream output = new FileOutputStream(file)) {
                    output.write(bytes);
                }

                Uri uri = FileProvider.getUriForFile(
                        activity,
                        activity.getPackageName() + ".files",
                        file
                );

                activity.runOnUiThread(() -> {
                    try {
                        Intent intent = new Intent(Intent.ACTION_SEND);
                        intent.setType(normalizeMime(mimeType));
                        intent.putExtra(Intent.EXTRA_STREAM, uri);
                        StringBuilder body = new StringBuilder();
                        if (text != null && !text.trim().isEmpty()) body.append(text.trim());
                        if (title != null && !title.trim().isEmpty()) {
                            intent.putExtra(Intent.EXTRA_SUBJECT, title.trim());
                        }
                        if (body.length() > 0) intent.putExtra(Intent.EXTRA_TEXT, body.toString());
                        intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                        activity.startActivity(Intent.createChooser(intent, "Dosyayı paylaş"));
                    } catch (Exception error) {
                        toast("Dosya paylaşımı açılamadı.");
                    }
                });
            } catch (Exception error) {
                toast("Dosya paylaşıma hazırlanamadı.");
            }
        });
    }

    @JavascriptInterface
    public void saveFile(String dataUrl, String fileName, String mimeType) {
        executor.execute(() -> {
            try {
                byte[] bytes = decodeDataUrl(dataUrl);
                String safeName = safeFileName(fileName, mimeType);
                String mime = normalizeMime(mimeType);
                String savedLocation;

                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                    ContentResolver resolver = activity.getContentResolver();
                    ContentValues values = new ContentValues();
                    values.put(MediaStore.Downloads.DISPLAY_NAME, safeName);
                    values.put(MediaStore.Downloads.MIME_TYPE, mime);
                    values.put(MediaStore.Downloads.RELATIVE_PATH, Environment.DIRECTORY_DOWNLOADS + "/ServisYonetim");
                    values.put(MediaStore.Downloads.IS_PENDING, 1);
                    Uri uri = resolver.insert(MediaStore.Downloads.EXTERNAL_CONTENT_URI, values);
                    if (uri == null) throw new IllegalStateException("Dosya kaydı oluşturulamadı");
                    try (OutputStream output = resolver.openOutputStream(uri)) {
                        if (output == null) throw new IllegalStateException("Dosya açılamadı");
                        output.write(bytes);
                    }
                    values.clear();
                    values.put(MediaStore.Downloads.IS_PENDING, 0);
                    resolver.update(uri, values, null, null);
                    savedLocation = "İndirilenler/ServisYonetim";
                } else {
                    File dir = activity.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS);
                    if (dir == null) dir = new File(activity.getFilesDir(), "downloads");
                    if (!dir.exists() && !dir.mkdirs()) {
                        throw new IllegalStateException("İndirme klasörü oluşturulamadı");
                    }
                    File file = uniqueFile(dir, safeName);
                    try (FileOutputStream output = new FileOutputStream(file)) {
                        output.write(bytes);
                    }
                    savedLocation = file.getAbsolutePath();
                }

                toast("Dosya kaydedildi: " + savedLocation);
            } catch (Exception error) {
                toast("Dosya kaydedilemedi.");
            }
        });
    }


    private String sha256Hex(String value) throws Exception {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] bytes = digest.digest(value.getBytes(StandardCharsets.UTF_8));
        StringBuilder hex = new StringBuilder(bytes.length * 2);
        for (byte item : bytes) {
            hex.append(String.format(Locale.ROOT, "%02x", item & 0xff));
        }
        return hex.toString();
    }

    private String readText(InputStream input) throws Exception {
        if (input == null) return "";
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(input, StandardCharsets.UTF_8)
        )) {
            StringBuilder body = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                body.append(line).append('\n');
            }
            return body.toString().trim();
        }
    }

    private byte[] decodeDataUrl(String dataUrl) throws Exception {
        if (dataUrl == null || dataUrl.trim().isEmpty()) {
            throw new IllegalArgumentException("Boş dosya");
        }
        int comma = dataUrl.indexOf(',');
        if (comma < 0) {
            return Base64.decode(dataUrl, Base64.DEFAULT);
        }
        String header = dataUrl.substring(0, comma).toLowerCase(Locale.ROOT);
        String payload = dataUrl.substring(comma + 1);
        if (header.contains(";base64")) {
            return Base64.decode(payload, Base64.DEFAULT);
        }
        return URLDecoder.decode(payload, "UTF-8").getBytes(StandardCharsets.UTF_8);
    }

    private String normalizeMime(String mimeType) {
        if (mimeType == null || mimeType.trim().isEmpty()) return "application/octet-stream";
        return mimeType.trim();
    }

    private String safeFileName(String fileName, String mimeType) {
        String value = fileName == null ? "dosya" : fileName.trim();
        value = value.replaceAll("[\\\\/:*?\"<>|\\p{Cntrl}]", "_");
        if (value.trim().isEmpty()) value = "dosya";
        if (!value.contains(".")) {
            String mime = normalizeMime(mimeType).toLowerCase(Locale.ROOT);
            if (mime.contains("pdf")) value += ".pdf";
            else if (mime.contains("json")) value += ".json";
            else if (mime.contains("png")) value += ".png";
            else if (mime.contains("jpeg") || mime.contains("jpg")) value += ".jpg";
        }
        return value;
    }

    private File uniqueFile(File dir, String name) {
        File candidate = new File(dir, name);
        if (!candidate.exists()) return candidate;
        int dot = name.lastIndexOf('.');
        String base = dot > 0 ? name.substring(0, dot) : name;
        String ext = dot > 0 ? name.substring(dot) : "";
        int index = 2;
        while (candidate.exists()) {
            candidate = new File(dir, base + " (" + index + ")" + ext);
            index++;
        }
        return candidate;
    }

    private void toast(String message) {
        activity.runOnUiThread(() -> Toast.makeText(activity, message, Toast.LENGTH_LONG).show());
    }

    void shutdown() {
        executor.shutdownNow();
    }
}
