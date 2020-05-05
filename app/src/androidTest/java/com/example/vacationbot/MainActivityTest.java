package com.example.vacationbot;

import org.junit.Test;

import android.app.Service;
import android.content.Intent;
import android.content.Context;
import android.net.DnsResolver;
import android.speech.RecognizerIntent;
import android.view.View;

import androidx.recyclerview.widget.SortedList;

import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;

import com.google.api.client.util.Data;
import com.google.cloud.dialogflow.v2.DetectIntentResponse;
import com.squareup.okhttp.Response;
import com.squareup.okhttp.internal.Util;

import org.junit.Rule;
import org.junit.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.MockitoJUnitRunner;
import org.mockito.stubbing.Answer;
import org.mockito.junit.MockitoJUnit;
import org.mockito.junit.MockitoRule;

import java.util.Locale;

import static org.junit.Assert.*;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.atLeast;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
@RunWith(MockitoJUnitRunner.class)
public class MainActivityTest<ActionHandler> {

    @Rule
    public MockitoRule rule = MockitoJUnit.rule();

    public void setup() {
        MockitoAnnotations.initMocks(this);
    }

    @Mock
    Intent intent;
    View view;
    private Service service;
    DetectIntentResponse res;

    @Captor
    private ArgumentCaptor<DnsResolver.Callback<Response>> callbackCaptor;

    @Test
    public void onCreate(){

    }

    @Test
    public void callbackV2() {
//        ActionHandler handler = new ActionHandler(service);
//        handler.callbackV2();
//
//        verify(service).doAction(anyString(), callbackCaptor.capture());
//
//        Callback<Response> callback = callbackCaptor.getValue();
//        Response response = new Response();
//
//        String expectedMessage = "Successful data response";
//        res = response.getData();
//        assertEquals("Should receive a successful message: ", expectedMessage, data.getMessage());
    }


    @Test
    public void displaySpeechRecognizer() {
//        try {
//            when(intent.putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM));
//            Util.displaySpeechRecognizer(view);
//            verify(intent, times(1)).putExtra(RecognizerIntent.EXTRA_LANGUAGE, Locale.getDefault());
//
//        } catch (Exception e) {
//            e.printStackTrace();
//            fail();
//        }
    }

    @Test
    public void onActivityResult() {
    }
}