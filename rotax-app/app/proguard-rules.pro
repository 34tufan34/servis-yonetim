# Servis Yönetim Sistemi WebView köprüsü
-keepclassmembers class com.tufan.servisyonetim.AndroidBridge {
    @android.webkit.JavascriptInterface <methods>;
}
