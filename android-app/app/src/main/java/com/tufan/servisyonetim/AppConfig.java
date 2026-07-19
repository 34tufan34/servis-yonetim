package com.tufan.servisyonetim;

public final class AppConfig {
    private AppConfig() {}

    public static final String REMOTE_APP_URL = "https://34tufan34.github.io/servis-yonetim/";
    public static final String LOCAL_APP_URL = "file:///android_asset/www/index.html";
    // APK, ağ veya Service Worker takılmasına bağlı kalmadan yerel kopyadan açılır.
    public static final String APP_URL = LOCAL_APP_URL;
    public static final String ALLOWED_HOST = "34tufan34.github.io";
    public static final String WEB_VERSION = "4.46.9";
    public static final String LICENSE_API_URL = "https://servis-lisans-api.ops-429.workers.dev";
    public static final String APK_VERSION = "1.0.10";
}
