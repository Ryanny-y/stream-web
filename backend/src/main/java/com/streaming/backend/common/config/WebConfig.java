package com.streaming.backend.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/videos/**")
                .addResourceLocations(toResourceLocation("upload/videos"));

        registry.addResourceHandler("/images/**")
                .addResourceLocations(toResourceLocation("upload/images"));
    }

    private String toResourceLocation(String directory) {
        return Paths.get(directory)
                .toAbsolutePath()
                .normalize()
                .toUri()
                .toString();
    }
}
