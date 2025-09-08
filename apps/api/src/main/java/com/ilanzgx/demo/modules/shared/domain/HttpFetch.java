package com.ilanzgx.demo.modules.shared.domain;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface HttpFetch {
    <T> ResponseEntity<T> get(String url, Map<String, String> headers, Class<T> responseType);
    <T, B> ResponseEntity<T> post(String url, Map<String, String> headers, B body, Class<T> responseType);
    <T, B> ResponseEntity<T> put(String url, Map<String, String> headers, B body, Class<T> responseType);
    <T> ResponseEntity<T> delete(String url, Map<String, String> headers, Class<T> responseType);
}

/*
    Exemplo de uso
 * var response = httpFetch.get(
            "https://brapi.dev/api/quote/PETR4",
                Map.of(
                    "Authorization", "Bearer token",
                    "Accept", "application/json"
                ),
            String.class
        );
        System.out.println(response.getBody());
        System.out.println(response.getStatusCode());
        System.out.println(response.getHeaders());
        System.out.println(response);
 */