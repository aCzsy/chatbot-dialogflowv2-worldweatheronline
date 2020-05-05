package com.example.vacationbot;

import android.content.Intent;
import androidx.test.core.app.ActivityScenario;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;

import static org.junit.Assert.assertEquals;
import static org.robolectric.Shadows.shadowOf;

@RunWith(RobolectricTestRunner.class)
public class SplashScreenTest {
    //Artis & Jan
    @Test
    public void onCreate() {
        try(ActivityScenario<SplashScreen> scenario = ActivityScenario.launch(SplashScreen.class)) {
            scenario.onActivity(activity -> {
                Intent expectedIntent = new Intent(activity, MainActivity.class);
                Intent actual = shadowOf(RuntimeEnvironment.application).getNextStartedActivity();
                assertEquals(expectedIntent.getComponent(), actual.getComponent());
            });
        }

    }
}