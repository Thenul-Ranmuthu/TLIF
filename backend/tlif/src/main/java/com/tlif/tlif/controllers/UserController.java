// package com.tlif.tlif.controllers;

// import org.springframework.web.bind.annotation.RestController;

// import com.tlif.tlif.dto.UserLoginResponseDto;
// import com.tlif.tlif.services.interfaces.UserAuthService;

// import jakarta.servlet.http.HttpSession;
// import lombok.RequiredArgsConstructor;

// import org.springframework.http.ResponseEntity;
// import org.springframework.web.bind.annotation.GetMapping;
// import org.springframework.web.bind.annotation.RequestMapping;


// @RestController
// @RequiredArgsConstructor
// @RequestMapping("/user")
// public class UserController {
//     private final UserAuthService userAuthService;

//     @GetMapping("/me")
//     public ResponseEntity<UserLoginResponseDto> getMethodName(HttpSession session) {
//         // UsernamePasswordAuthenticationToken token = (UsernamePasswordAuthenticationToken) authentication;
//         // String microsoftId = token.getPrincipal().getAttributes().get("sub").toString();

//         // return userAuthService.userLogin(microsoftId);
//         // String userId = (String) session.getAttribute("userId");

//         // if (userId == null) {
//         //     return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
//         // }

//         // User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//         ResponseEntity<UserLoginResponseDto> response = userAuthService.userLogin(session);
//         return response;
//     }
    
// }
