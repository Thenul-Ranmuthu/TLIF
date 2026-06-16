package com.tlif.tlif.Security;

import java.io.IOException;
import java.util.Map;

import org.springframework.security.core.Authentication;
// import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.tlif.tlif.Enums.UserRole;
import com.tlif.tlif.entity.User;
import com.tlif.tlif.repositories.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler{

    // private static final String SLIIT_TENANT_ID = "44e3cf94-19c9-4e32-96c3-14f5bf01391a";

    private final UserRepository userRepository;
    // private final JwtService jwtService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
            Authentication authentication) throws IOException {
        
            OAuth2AuthenticationToken token = (OAuth2AuthenticationToken) authentication;
            Map<String, Object> attributes = token.getPrincipal().getAttributes();

            // String issuer = attributes.get("iss").toString();
            // if(!issuer.contains(SLIIT_TENANT_ID)){
            //     SecurityContextHolder.clearContext();
            //     response.sendRedirect("/login?error=unauthorized_tenant");
            //     return;
            // }

            // Auto-register if first login
            String microsoftId = attributes.get("sub").toString();
            User user = userRepository.findByMicrosoftId(microsoftId).orElseGet(() -> {
                User newUser = new User();
                newUser.setMicrosoftId(microsoftId);
                newUser.setEmail(attributes.getOrDefault("email", "").toString());
                newUser.setUserName(attributes.getOrDefault("name", "Unknown").toString());
                return userRepository.save(newUser);
                
            });
        request.getSession().setAttribute("userId", user.getId());
        request.getSession().setAttribute("role", user.getRole());

        if(user.getRole() == UserRole.APPLICANT){
            response.sendRedirect("http://localhost:5050/applicant");
        }else if(user.getRole() == UserRole.GRANTEE){
            response.sendRedirect("http://localhost:5050/grantee");
        }
        
            
    }

    
}
