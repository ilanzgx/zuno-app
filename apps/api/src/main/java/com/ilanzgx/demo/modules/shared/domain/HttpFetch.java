package com.ilanzgx.demo.modules.shared.domain;

import java.util.Map;

import org.springframework.http.ResponseEntity;

public interface HttpFetch {
    <T> ResponseEntity<T> get(String url, Map<String, String> headers, Class<T> responseType);
    <T, B> ResponseEntity<T> post(String url, Map<String, String> headers, B body, Class<T> responseType);
    <T, B> ResponseEntity<T> put(String url, Map<String, String> headers, B body, Class<T> responseType);
    <T> ResponseEntity<T> delete(String url, Map<String, String> headers, Class<T> responseType);
}