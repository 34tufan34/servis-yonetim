package com.tufan.servisyonetim;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.documentfile.provider.DocumentFile;
import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import org.json.JSONObject;

import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.GCMParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;

public class CloudBackupWorker extends Worker {
    static final String PREFS="sys_cloud_backup";
    static final String UNIQUE="sys-cloud-backup-daily";
    public CloudBackupWorker(@NonNull Context c,@NonNull WorkerParameters p){super(c,p);}

    @NonNull @Override public Result doWork(){
        SharedPreferences p=getApplicationContext().getSharedPreferences(PREFS,Context.MODE_PRIVATE);
        if(!p.getBoolean("enabled",false)) return Result.success();
        String tree=p.getString("treeUri",""); String payload=p.getString("payload",""); String password=p.getString("password","");
        if(tree.isEmpty()||payload.isEmpty()){p.edit().putString("lastError","Drive klasörü veya yedek verisi hazır değil.").apply();scheduleNext(getApplicationContext(),p);return Result.retry();}
        try{
            DocumentFile dir=DocumentFile.fromTreeUri(getApplicationContext(),Uri.parse(tree));
            if(dir==null||!dir.canWrite())throw new IllegalStateException("Seçilen Drive klasörüne yazılamıyor.");
            String stamp=new SimpleDateFormat("yyyy-MM-dd-HH-mm",Locale.US).format(new Date());
            String name="SYS-TAM-YEDEK-"+stamp+".sysbackup";
            DocumentFile file=dir.createFile("application/octet-stream",name); if(file==null)throw new IllegalStateException("Yedek dosyası oluşturulamadı.");
            byte[] data=password.length()>=6?encrypt(payload,password):payload.getBytes(StandardCharsets.UTF_8);
            try(OutputStream out=getApplicationContext().getContentResolver().openOutputStream(file.getUri(),"w")){if(out==null)throw new IllegalStateException("Yedek dosyası açılamadı.");out.write(data);}
            p.edit().putString("lastSuccess",new SimpleDateFormat("dd.MM.yyyy HH:mm",new Locale("tr","TR")).format(new Date())).putString("lastError","").putString("lastFile",name).apply();
            cleanup(dir,Math.max(2,p.getInt("keepDays",30)));
            scheduleNext(getApplicationContext(),p); return Result.success();
        }catch(Exception e){p.edit().putString("lastError",e.getMessage()==null?"Bulut yedekleme başarısız.":e.getMessage()).apply();scheduleNext(getApplicationContext(),p);return Result.retry();}
    }
    private static byte[] encrypt(String text,String password)throws Exception{
        byte[] salt=new byte[16],iv=new byte[12];SecureRandom r=new SecureRandom();r.nextBytes(salt);r.nextBytes(iv);
        PBEKeySpec spec=new PBEKeySpec(password.toCharArray(),salt,120000,256);byte[] key=SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded();
        Cipher c=Cipher.getInstance("AES/GCM/NoPadding");c.init(Cipher.ENCRYPT_MODE,new SecretKeySpec(key,"AES"),new GCMParameterSpec(128,iv));byte[] enc=c.doFinal(text.getBytes(StandardCharsets.UTF_8));
        JSONObject box=new JSONObject();box.put("format","SYSBACKUP-AES-GCM-1");box.put("salt",Base64.encodeToString(salt,Base64.NO_WRAP));box.put("iv",Base64.encodeToString(iv,Base64.NO_WRAP));box.put("data",Base64.encodeToString(enc,Base64.NO_WRAP));return box.toString().getBytes(StandardCharsets.UTF_8);
    }
    private static void cleanup(DocumentFile dir,int keepDays){
        long cutoff=System.currentTimeMillis()-TimeUnit.DAYS.toMillis(keepDays);for(DocumentFile f:dir.listFiles()){String n=f.getName();if(n!=null&&n.startsWith("SYS-TAM-YEDEK-")&&f.lastModified()>0&&f.lastModified()<cutoff)f.delete();}
    }
    static void scheduleNext(Context c,SharedPreferences p){
        if(!p.getBoolean("enabled",false)){WorkManager.getInstance(c).cancelUniqueWork(UNIQUE);return;}
        String[] t=p.getString("time","23:30").split(":");int h=23,m=30;try{h=Integer.parseInt(t[0]);m=Integer.parseInt(t[1]);}catch(Exception ignored){}
        Calendar now=Calendar.getInstance(),next=Calendar.getInstance();next.set(Calendar.HOUR_OF_DAY,h);next.set(Calendar.MINUTE,m);next.set(Calendar.SECOND,0);next.set(Calendar.MILLISECOND,0);if(!next.after(now))next.add(Calendar.DAY_OF_YEAR,1);
        NetworkType nt=p.getBoolean("wifiOnly",false)?NetworkType.UNMETERED:NetworkType.CONNECTED;
        Constraints constraints=new Constraints.Builder().setRequiredNetworkType(nt).build();
        OneTimeWorkRequest req=new OneTimeWorkRequest.Builder(CloudBackupWorker.class).setInitialDelay(next.getTimeInMillis()-now.getTimeInMillis(),TimeUnit.MILLISECONDS).setConstraints(constraints).setBackoffCriteria(BackoffPolicy.EXPONENTIAL,30,TimeUnit.MINUTES).build();
        WorkManager.getInstance(c).enqueueUniqueWork(UNIQUE,ExistingWorkPolicy.REPLACE,req);
    }
    static void runNow(Context c){
        SharedPreferences p=c.getSharedPreferences(PREFS,Context.MODE_PRIVATE);NetworkType nt=p.getBoolean("wifiOnly",false)?NetworkType.UNMETERED:NetworkType.CONNECTED;
        OneTimeWorkRequest req=new OneTimeWorkRequest.Builder(CloudBackupWorker.class).setConstraints(new Constraints.Builder().setRequiredNetworkType(nt).build()).build();WorkManager.getInstance(c).enqueue(req);
    }
}
