package com.example.early_flood_alert_system;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;

import android.graphics.Color;
import android.os.Bundle;
import android.widget.TextView;

import com.google.firebase.database.ChildEventListener;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.Query;
import com.google.firebase.database.ValueEventListener;

import java.util.ArrayList;
import java.util.Map;

public class MainActivity extends AppCompatActivity {

    private DatabaseReference mConvDatabase;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        mConvDatabase = FirebaseDatabase.getInstance().getReference().child("flood_alert").child("station1");
        mConvDatabase.keepSynced(true);

        Query messageQuery = mConvDatabase.orderByKey().limitToLast(1);

        messageQuery.addValueEventListener(new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot dataSnapshot) {

                if (dataSnapshot.exists()) {
                    ArrayList<String> list_subjects = new ArrayList<>();
                    ArrayList<Map<String, Object>> dataList = new ArrayList<>();
                    for (DataSnapshot snapshot : dataSnapshot.getChildren()) {
                        String id = snapshot.getKey();

                        // Get data as Map
                        Map<String, Object> data = (Map<String, Object>) snapshot.getValue();

                        list_subjects.add(id);
                        dataList.add(data);

                        try {
                            if (data != null) {
                                String status = (String) data.get("status");
                                String timestamp = (String) data.get("timestamp");
                                Object water_level = String.valueOf((Object) data.get("water_level"));
                                String temperatureStr = String.valueOf((Object) data.get("temperature"));
                                String humidity = String.valueOf((Object) data.get("humidity"));
                                ((TextView)findViewById(R.id.txtStatus)).setText("Status: "+status);
                                ((TextView)findViewById(R.id.txtWaterLevel)).setText("Water Level: "+water_level);
                                ((TextView)findViewById(R.id.txtTemperature)).setText("Temperature: "+temperatureStr);
                                ((TextView)findViewById(R.id.txtHumidity)).setText("Humidity: "+humidity);
                                ((TextView)findViewById(R.id.txtTimeStamp)).setText("Time: "+timestamp);

                                if (status.equals("DANGER")){
                                    ((TextView)findViewById(R.id.txtStatus)).setText("Status: DANGER ZONE");
                                    ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.RED);
                                }else if (status.equals("WARNING")){
                                    ((TextView)findViewById(R.id.txtStatus)).setText("Status: WARNING ZONE");
                                    ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.BLUE);
                                }else if (status.equals("SAFE")){
                                    ((TextView)findViewById(R.id.txtStatus)).setText("Status: SAFE ZONE");
                                    ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.GREEN);
                                }
                            }
                        }catch (NullPointerException e){

                        }



                    }
                }




                /*if (snapshot.exists()) {
                    Map<String, Object> userMap = (Map<String, Object>) snapshot.getValue();
                    if (userMap != null) {
                        //String status = (String) userMap.get("status");
                        long water_level = (long) userMap.get("water_level");
                        //double temperature = (double) userMap.get("temperature");
                        //double humidity = (double) userMap.get("humidity");
                        //((TextView)findViewById(R.id.txtStatus)).setText("Status: "+status);
                        ((TextView)findViewById(R.id.txtWaterLevel)).setText("Water Level: "+water_level);
                        //((TextView)findViewById(R.id.txtTemperature)).setText("Temperature: "+temperature);
                        //((TextView)findViewById(R.id.txtHumidity)).setText("Humidity: "+humidity);

                        if (water_level <= 25){
                            ((TextView)findViewById(R.id.txtStatus)).setText("Status: DANGER");
                            ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.RED);
                        }else if (water_level <= 50){
                            ((TextView)findViewById(R.id.txtStatus)).setText("Status: WARNING");
                            ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.BLUE);
                        }else if (water_level <= 100){
                            ((TextView)findViewById(R.id.txtStatus)).setText("Status: SAFE ZONE");
                            ((TextView)findViewById(R.id.txtStatus)).setTextColor(Color.GREEN);
                        }
                    }
                }*/

            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {

            }
        });

    }
}