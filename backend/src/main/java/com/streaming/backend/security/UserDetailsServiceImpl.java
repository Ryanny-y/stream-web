package com.streaming.backend.security;

import com.streaming.backend.repositories.AuthRepository;
import com.streaming.backend.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final AuthRepository authRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        return authRepository
                .findByUsernameOrEmail(usernameOrEmail, usernameOrEmail)
                .map(UserPrincipal::new)
                .orElseThrow(() ->
                        new UsernameNotFoundException("User not found: " + usernameOrEmail)
                );
    }
}