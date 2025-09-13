package com.ilanzgx.demo.modules.shared.application;

import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.ilanzgx.demo.modules.shared.domain.HttpFetch;

@Component
public class HttpFetchImpl implements HttpFetch {
    public <T> ResponseEntity<T> get(String url, Map<String, String> headers, Class<T> responseType) {
        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders(headers));
        return restTemplate().exchange(url, HttpMethod.GET, entity, responseType);
    }

    public <T, B> ResponseEntity<T> post(String url, Map<String, String> headers, B body, Class<T> responseType) {
        HttpEntity<B> entity = new HttpEntity<>(body, buildHeaders(headers));
        return restTemplate().exchange(url, HttpMethod.POST, entity, responseType);
    }

    public <T, B> ResponseEntity<T> put(String url, Map<String, String> headers, B body, Class<T> responseType) {
        HttpEntity<B> entity = new HttpEntity<>(body, buildHeaders(headers));
        return restTemplate().exchange(url, HttpMethod.PUT, entity, responseType);
    }

    public <T> ResponseEntity<T> delete(String url, Map<String, String> headers, Class<T> responseType) {
        HttpEntity<Void> entity = new HttpEntity<>(buildHeaders(headers));
        return restTemplate().exchange(url, HttpMethod.DELETE, entity, responseType);
    }

    private HttpHeaders buildHeaders(Map<String, String> headers) {
        HttpHeaders httpHeaders = new HttpHeaders();
        if (headers != null) {
            headers.forEach(httpHeaders::add);
        }
        return httpHeaders;
    }

    @Bean
    private RestTemplate restTemplate() {
        return new RestTemplate();
    }
}