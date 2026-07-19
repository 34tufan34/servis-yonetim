package com.tufan.servisyonetim;

import android.Manifest;
import android.app.Activity;
import android.app.DownloadManager;
import android.content.ActivityNotFoundException;
import android.content.ClipData;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Looper;
import android.provider.Settings;
import android.speech.RecognizerIntent;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintManager;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.CookieManager;
import android.webkit.GeolocationPermissions;
import android.webkit.MimeTypeMap;
import android.webkit.PermissionRequest;
import android.webkit.ServiceWorkerClient;
import android.webkit.ServiceWorkerController;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.LinkedHashSet;
import java.util.Set;

import org.json.JSONObject;

public class MainActivity extends Activity {
    private static final int FILE_CHOOSER_REQUEST = 1001;
    private static final int LOCATION_PERMISSION_REQUEST = 1002;
    private static final int VOICE_RECOGNITION_REQUEST = 1003;
    private static final int MICROPHONE_PERMISSION_REQUEST = 1004;
    private static final int WEB_AUDIO_PERMISSION_REQUEST = 1005;

    private WebView webView;
    private ProgressBar progressBar;
    private ValueCallback<Uri[]> pendingFileCallback;
    private GeolocationPermissions.Callback pendingGeoCallback;
    private String pendingGeoOrigin;
    private AndroidBridge androidBridge;
    private String nativeBridgeScript = "";
    private String pendingVoicePrompt = "Şoför komutunu söyleyin";
    private PermissionRequest pendingWebAudioPermissionRequest;
    private final Handler loadHandler = new Handler(Looper.getMainLooper());
    private final Runnable loadSafetyTask = this::handleLoadSafetyTimeout;
    private boolean loadErrorPageShown = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setStatusBarColor(Color.rgb(8, 9, 13));
        getWindow().setNavigationBarColor(Color.rgb(8, 9, 13));

        FrameLayout root = new FrameLayout(this);
        root.setBackgroundColor(Color.rgb(8, 9, 13));

        webView = new WebView(this);
        webView.setBackgroundColor(Color.rgb(8, 9, 13));
        root.addView(webView, new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
        ));

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        FrameLayout.LayoutParams progressParams = new FrameLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(3)
        );
        progressParams.gravity = android.view.Gravity.TOP;
        root.addView(progressBar, progressParams);

        setContentView(root);
        nativeBridgeScript = readAssetText("native-bridge.js");
        configureWebView();

        // WebView geçmişindeki yarım kalmış uzak sayfayı geri yükleme.
        // APK içindeki doğrulanmış uygulama kopyası her açılışta doğrudan yüklenir.
        webView.loadUrl(AppConfig.APP_URL);
    }

    private void configureWebView() {
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setLoadsImagesAutomatically(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE);
        settings.setUserAgentString(settings.getUserAgentString() + " ServisYonetimAPK/" + AppConfig.APK_VERSION);

        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            ServiceWorkerController.getInstance().setServiceWorkerClient(new ServiceWorkerClient() {
                @Override
                public WebResourceResponse shouldInterceptRequest(WebResourceRequest request) {
                    return null;
                }
            });
        }

        androidBridge = new AndroidBridge(this);
        webView.addJavascriptInterface(androidBridge, "AndroidBridge");
        webView.setWebViewClient(new ServisWebViewClient());
        webView.setWebChromeClient(new ServisWebChromeClient());
        webView.setDownloadListener(this::handleDownload);
    }

    private final class ServisWebViewClient extends WebViewClient {
        @Override
        public void onPageStarted(WebView view, String url, android.graphics.Bitmap favicon) {
            super.onPageStarted(view, url, favicon);
            loadErrorPageShown = false;
            progressBar.setProgress(5);
            progressBar.setVisibility(View.VISIBLE);
            scheduleLoadSafety();
        }

        @Override
        public void onPageCommitVisible(WebView view, String url) {
            super.onPageCommitVisible(view, url);
            // İlk içerik ekrana geldiğinde üstteki ince yükleme çubuğunu kaldır.
            progressBar.setVisibility(View.GONE);
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
            return handleNavigation(request.getUrl());
        }

        @Override
        public boolean shouldOverrideUrlLoading(WebView view, String url) {
            return handleNavigation(Uri.parse(url));
        }

        @Override
        public void onPageFinished(WebView view, String url) {
            super.onPageFinished(view, url);
            cancelLoadSafety();
            progressBar.setVisibility(View.GONE);
            if (!nativeBridgeScript.trim().isEmpty() && isTrustedAppUrl(Uri.parse(url))) {
                view.evaluateJavascript(nativeBridgeScript, null);
            }
        }

        @Override
        public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
            super.onReceivedError(view, request, error);
            if (request.isForMainFrame()) {
                cancelLoadSafety();
                progressBar.setVisibility(View.GONE);
                showLoadErrorPage("Uygulama sayfası yüklenemedi. Android System WebView bileşenini güncelleyip tekrar deneyin.");
            }
        }
    }

    private final class ServisWebChromeClient extends WebChromeClient {
        @Override
        public void onProgressChanged(WebView view, int newProgress) {
            progressBar.setProgress(newProgress);
            progressBar.setVisibility(newProgress >= 100 ? View.GONE : View.VISIBLE);
        }

        @Override
        public boolean onShowFileChooser(
                WebView webView,
                ValueCallback<Uri[]> filePathCallback,
                FileChooserParams fileChooserParams
        ) {
            if (pendingFileCallback != null) pendingFileCallback.onReceiveValue(null);
            pendingFileCallback = filePathCallback;

            Intent intent = new Intent(Intent.ACTION_OPEN_DOCUMENT);
            intent.addCategory(Intent.CATEGORY_OPENABLE);
            intent.setType(resolvePrimaryMime(fileChooserParams.getAcceptTypes()));
            String[] mimeTypes = cleanMimeTypes(fileChooserParams.getAcceptTypes());
            if (mimeTypes.length > 1) intent.putExtra(Intent.EXTRA_MIME_TYPES, mimeTypes);
            intent.putExtra(Intent.EXTRA_ALLOW_MULTIPLE,
                    fileChooserParams.getMode() == FileChooserParams.MODE_OPEN_MULTIPLE);

            try {
                startActivityForResult(intent, FILE_CHOOSER_REQUEST);
                return true;
            } catch (ActivityNotFoundException error) {
                pendingFileCallback = null;
                Toast.makeText(MainActivity.this, "Dosya seçici açılamadı.", Toast.LENGTH_LONG).show();
                return false;
            }
        }

        @Override
        public void onPermissionRequest(PermissionRequest request) {
            runOnUiThread(() -> {
                if (request == null || !isTrustedAppUrl(request.getOrigin())) {
                    if (request != null) request.deny();
                    return;
                }

                boolean wantsAudio = false;
                for (String resource : request.getResources()) {
                    if (PermissionRequest.RESOURCE_AUDIO_CAPTURE.equals(resource)) {
                        wantsAudio = true;
                        break;
                    }
                }
                if (!wantsAudio) {
                    request.deny();
                    return;
                }

                if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M
                        || checkSelfPermission(Manifest.permission.RECORD_AUDIO) == PackageManager.PERMISSION_GRANTED) {
                    request.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
                    return;
                }

                pendingWebAudioPermissionRequest = request;
                requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, WEB_AUDIO_PERMISSION_REQUEST);
            });
        }

        @Override
        public void onPermissionRequestCanceled(PermissionRequest request) {
            if (pendingWebAudioPermissionRequest == request) pendingWebAudioPermissionRequest = null;
        }

        @Override
        public void onGeolocationPermissionsShowPrompt(
                String origin,
                GeolocationPermissions.Callback callback
        ) {
            if (!isTrustedAppUrl(Uri.parse(origin))) {
                callback.invoke(origin, false, false);
                return;
            }
            if (checkSelfPermission(Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED
                    || checkSelfPermission(Manifest.permission.ACCESS_COARSE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                callback.invoke(origin, true, true);
                return;
            }
            pendingGeoOrigin = origin;
            pendingGeoCallback = callback;
            requestPermissions(new String[]{
                    Manifest.permission.ACCESS_FINE_LOCATION,
                    Manifest.permission.ACCESS_COARSE_LOCATION
            }, LOCATION_PERMISSION_REQUEST);
        }
    }

    private boolean handleNavigation(Uri uri) {
        if (uri == null) return false;
        String scheme = uri.getScheme() == null ? "" : uri.getScheme().toLowerCase();
        if (isTrustedAppUrl(uri)) {
            return false;
        }

        if ("intent".equals(scheme)) {
            try {
                Intent intent = Intent.parseUri(uri.toString(), Intent.URI_INTENT_SCHEME);
                startActivity(intent);
            } catch (URISyntaxException | ActivityNotFoundException error) {
                Toast.makeText(this, "Bağlantıyı açacak uygulama bulunamadı.", Toast.LENGTH_LONG).show();
            }
            return true;
        }

        try {
            Intent intent = new Intent(Intent.ACTION_VIEW, uri);
            startActivity(intent);
        } catch (ActivityNotFoundException error) {
            Toast.makeText(this, "Bağlantıyı açacak uygulama bulunamadı.", Toast.LENGTH_LONG).show();
        }
        return true;
    }

    private boolean isTrustedAppUrl(Uri uri) {
        if (uri == null) return false;
        String scheme = uri.getScheme() == null ? "" : uri.getScheme();
        String path = uri.getPath() == null ? "" : uri.getPath();
        if ("file".equalsIgnoreCase(scheme) && path.startsWith("/android_asset/www/")) {
            return true;
        }
        String host = uri.getHost();
        return "https".equalsIgnoreCase(scheme)
                && host != null
                && (host.equalsIgnoreCase(AppConfig.ALLOWED_HOST)
                || host.toLowerCase().endsWith("." + AppConfig.ALLOWED_HOST));
    }

    private void scheduleLoadSafety() {
        loadHandler.removeCallbacks(loadSafetyTask);
        loadHandler.postDelayed(loadSafetyTask, 15000);
    }

    private void cancelLoadSafety() {
        loadHandler.removeCallbacks(loadSafetyTask);
    }

    private void handleLoadSafetyTimeout() {
        if (webView == null) return;
        progressBar.setVisibility(View.GONE);
        webView.evaluateJavascript(
                "(function(){try{var s=document.getElementById('sysSplash');if(s)s.remove();"
                        + "if(document.body){document.body.style.visibility='visible';document.body.style.opacity='1';}"
                        + "return !!(document.body&&document.body.children.length);}catch(e){return false;}})()",
                value -> {
                    if ("true".equals(value)) {
                        if (!nativeBridgeScript.trim().isEmpty()) {
                            webView.evaluateJavascript(nativeBridgeScript, null);
                        }
                        return;
                    }
                    showLoadErrorPage("Uygulama 15 saniye içinde açılamadı. Android System WebView ve Chrome uygulamalarını güncelleyin.");
                }
        );
    }

    private void showLoadErrorPage(String message) {
        if (webView == null || loadErrorPageShown) return;
        loadErrorPageShown = true;
        cancelLoadSafety();
        progressBar.setVisibility(View.GONE);
        webView.stopLoading();
        String safeMessage = message == null ? "Uygulama yüklenemedi." : message;
        String html = "<!doctype html><html><head><meta charset='utf-8'>"
                + "<meta name='viewport' content='width=device-width,initial-scale=1'>"
                + "<style>body{margin:0;min-height:100vh;display:grid;place-items:center;background:#08090d;color:#fff;font:16px system-ui;padding:24px;box-sizing:border-box}"
                + ".box{max-width:560px;background:#122026;border:1px solid #31505a;border-radius:20px;padding:28px;box-shadow:0 20px 60px #0008}"
                + "h2{margin-top:0}p{color:#b9d0d4;line-height:1.6}button{border:0;border-radius:12px;padding:13px 18px;font-weight:800;background:#19d3cf;color:#071012}</style></head>"
                + "<body><div class='box'><h2>Uygulama açılamadı</h2><p>" + android.text.TextUtils.htmlEncode(safeMessage) + "</p>"
                + "<a style='display:inline-block;text-decoration:none;border-radius:12px;padding:13px 18px;font-weight:800;background:#19d3cf;color:#071012' href='"
                + AppConfig.LOCAL_APP_URL + "'>Tekrar Dene</a></div></body></html>";
        webView.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
    }

    private void handleDownload(String url, String userAgent, String contentDisposition, String mimeType, long contentLength) {
        if (url == null || url.startsWith("blob:") || url.startsWith("data:")) {
            return; // Blob/data dosyaları native-bridge.js tarafından kaydedilir.
        }
        try {
            String fileName = android.webkit.URLUtil.guessFileName(url, contentDisposition, mimeType);
            DownloadManager.Request request = new DownloadManager.Request(Uri.parse(url));
            request.setTitle(fileName);
            request.setDescription("Servis Yönetim Sistemi dosyası indiriliyor");
            request.setMimeType(mimeType);
            request.addRequestHeader("User-Agent", userAgent);
            String cookie = CookieManager.getInstance().getCookie(url);
            if (cookie != null) request.addRequestHeader("Cookie", cookie);
            request.setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE_NOTIFY_COMPLETED);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
                request.setDestinationInExternalPublicDir(Environment.DIRECTORY_DOWNLOADS, fileName);
            } else {
                request.setDestinationInExternalFilesDir(this, Environment.DIRECTORY_DOWNLOADS, fileName);
            }
            DownloadManager manager = (DownloadManager) getSystemService(Context.DOWNLOAD_SERVICE);
            manager.enqueue(request);
            Toast.makeText(this, "İndirme başlatıldı.", Toast.LENGTH_SHORT).show();
        } catch (Exception error) {
            Toast.makeText(this, "Dosya indirilemedi.", Toast.LENGTH_LONG).show();
        }
    }

    private String resolvePrimaryMime(String[] acceptTypes) {
        String[] cleaned = cleanMimeTypes(acceptTypes);
        return cleaned.length == 1 ? cleaned[0] : "*/*";
    }

    private String[] cleanMimeTypes(String[] values) {
        Set<String> result = new LinkedHashSet<>();
        if (values != null) {
            for (String value : values) {
                if (value == null) continue;
                for (String token : value.split(",")) {
                    String mime = token.trim();
                    if (mime.startsWith(".")) {
                        String ext = mime.substring(1);
                        String detected = MimeTypeMap.getSingleton().getMimeTypeFromExtension(ext);
                        if (detected != null) result.add(detected);
                    } else if (mime.contains("/")) {
                        result.add(mime);
                    }
                }
            }
        }
        return result.toArray(new String[0]);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);

        if (requestCode == VOICE_RECOGNITION_REQUEST) {
            if (resultCode == RESULT_OK && data != null) {
                ArrayList<String> results = data.getStringArrayListExtra(RecognizerIntent.EXTRA_RESULTS);
                String spoken = results != null && !results.isEmpty() ? results.get(0) : "";
                deliverVoiceResult(spoken, spoken.trim().isEmpty() ? "Ses algılanamadı." : "");
            } else {
                deliverVoiceResult("", "Sesli komut iptal edildi.");
            }
            return;
        }

        if (requestCode != FILE_CHOOSER_REQUEST || pendingFileCallback == null) return;

        Uri[] results = null;
        if (resultCode == RESULT_OK && data != null) {
            ClipData clipData = data.getClipData();
            if (clipData != null) {
                ArrayList<Uri> uris = new ArrayList<>();
                for (int i = 0; i < clipData.getItemCount(); i++) {
                    Uri uri = clipData.getItemAt(i).getUri();
                    if (uri != null) uris.add(uri);
                }
                results = uris.toArray(new Uri[0]);
            } else if (data.getData() != null) {
                results = new Uri[]{data.getData()};
            }
        }
        pendingFileCallback.onReceiveValue(results);
        pendingFileCallback = null;
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == LOCATION_PERMISSION_REQUEST && pendingGeoCallback != null) {
            boolean granted = false;
            for (int result : grantResults) {
                if (result == PackageManager.PERMISSION_GRANTED) {
                    granted = true;
                    break;
                }
            }
            pendingGeoCallback.invoke(pendingGeoOrigin, granted, granted);
            pendingGeoCallback = null;
            pendingGeoOrigin = null;
            return;
        }
        if (requestCode == MICROPHONE_PERMISSION_REQUEST) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (granted) launchVoiceRecognizer();
            else deliverVoiceResult("", "Mikrofon izni verilmedi.");
            return;
        }
        if (requestCode == WEB_AUDIO_PERMISSION_REQUEST && pendingWebAudioPermissionRequest != null) {
            boolean granted = grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED;
            if (granted) {
                pendingWebAudioPermissionRequest.grant(new String[]{PermissionRequest.RESOURCE_AUDIO_CAPTURE});
            } else {
                pendingWebAudioPermissionRequest.deny();
            }
            pendingWebAudioPermissionRequest = null;
        }
    }

    void startVoiceRecognition(String prompt) {
        runOnUiThread(() -> {
            pendingVoicePrompt = prompt == null || prompt.trim().isEmpty()
                    ? "Şoför komutunu söyleyin"
                    : prompt.trim();
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M
                    && checkSelfPermission(Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{Manifest.permission.RECORD_AUDIO}, MICROPHONE_PERMISSION_REQUEST);
                return;
            }
            launchVoiceRecognizer();
        });
    }

    private void launchVoiceRecognizer() {
        try {
            Intent intent = new Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE, "tr-TR");
            intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_PREFERENCE, "tr-TR");
            intent.putExtra(RecognizerIntent.EXTRA_ONLY_RETURN_LANGUAGE_PREFERENCE, false);
            intent.putExtra(RecognizerIntent.EXTRA_PROMPT, pendingVoicePrompt);
            intent.putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 5);
            startActivityForResult(intent, VOICE_RECOGNITION_REQUEST);
        } catch (ActivityNotFoundException error) {
            deliverVoiceResult("", "Bu cihazda ses tanıma hizmeti bulunamadı.");
        } catch (Exception error) {
            deliverVoiceResult("", "Sesli komut başlatılamadı.");
        }
    }

    void evaluateJavascript(String script) {
        if (webView == null || script == null || script.trim().isEmpty()) return;
        webView.post(() -> {
            if (webView != null) webView.evaluateJavascript(script, null);
        });
    }

    private void deliverVoiceResult(String spokenText, String errorMessage) {
        if (webView == null) return;
        String spoken = spokenText == null ? "" : spokenText;
        String error = errorMessage == null ? "" : errorMessage;
        String script = "(function(){if(window.__servisReceiveVoiceCommand){window.__servisReceiveVoiceCommand("
                + JSONObject.quote(spoken) + "," + JSONObject.quote(error) + ");}})();";
        webView.post(() -> webView.evaluateJavascript(script, null));
    }

    void printCurrentPage(String requestedTitle) {
        runOnUiThread(() -> {
            if (webView == null) {
                Toast.makeText(this, "Yazdırılacak sayfa bulunamadı.", Toast.LENGTH_LONG).show();
                return;
            }
            try {
                String title = requestedTitle == null || requestedTitle.trim().isEmpty()
                        ? "Servis Yönetim Sistemi Raporu"
                        : requestedTitle.trim();
                PrintManager printManager = (PrintManager) getSystemService(Context.PRINT_SERVICE);
                PrintDocumentAdapter adapter = webView.createPrintDocumentAdapter(title);
                PrintAttributes attributes = new PrintAttributes.Builder()
                        .setMediaSize(PrintAttributes.MediaSize.ISO_A4.asLandscape())
                        .setColorMode(PrintAttributes.COLOR_MODE_COLOR)
                        .setMinMargins(PrintAttributes.Margins.NO_MARGINS)
                        .build();
                printManager.print(title, adapter, attributes);
            } catch (Exception error) {
                Toast.makeText(this, "Android yazdırma ekranı açılamadı.", Toast.LENGTH_LONG).show();
            }
        });
    }

    private void performDefaultBack() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    public void onBackPressed() {
        if (webView == null) {
            super.onBackPressed();
            return;
        }
        webView.evaluateJavascript(
                "(function(){try{return !!(window.__servisHandleAndroidBack && window.__servisHandleAndroidBack());}catch(e){return false;}})()",
                value -> {
                    if ("true".equals(value)) return;
                    performDefaultBack();
                }
        );
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        if (webView != null) webView.saveState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onDestroy() {
        cancelLoadSafety();
        if (androidBridge != null) androidBridge.shutdown();
        if (webView != null) {
            webView.removeJavascriptInterface("AndroidBridge");
            webView.stopLoading();
            webView.setWebChromeClient(null);
            webView.setWebViewClient(null);
            webView.destroy();
        }
        super.onDestroy();
    }

    private String readAssetText(String fileName) {
        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(getAssets().open(fileName), java.nio.charset.StandardCharsets.UTF_8)
        )) {
            StringBuilder result = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) result.append(line).append('\n');
            return result.toString();
        } catch (Exception error) {
            return "";
        }
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
