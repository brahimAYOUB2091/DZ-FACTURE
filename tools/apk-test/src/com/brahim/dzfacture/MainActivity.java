package com.brahim.dzfacture;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

// غلاف WebView بسيط لتجربة مجلد www على الهاتف دون Android Studio.
public class MainActivity extends Activity {
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        web = new WebView(this);
        WebSettings s = web.getSettings();
        s.setJavaScriptEnabled(true);
        s.setDomStorageEnabled(true);   // لحفظ اللغة والثيم (localStorage)
        web.setWebViewClient(new WebViewClient());
        setContentView(web);
        web.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        // زر الرجوع يعود إلى الشاشة الأولى (تنقّل بالـ hash) ثم يخرج
        if (web.canGoBack()) web.goBack(); else super.onBackPressed();
    }
}
