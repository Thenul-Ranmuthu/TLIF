package com.tlif.tlif.services;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.tlif.tlif.dto.UserLoginResponseDto;
import com.tlif.tlif.entity.User;
import com.tlif.tlif.repositories.UserRepository;
import com.tlif.tlif.services.interfaces.UserAuthService;

import jakarta.servlet.http.HttpSession;
import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class UserAuthServiceImpl implements UserAuthService{
    private UserRepository userRepository;
    // private JwtService jwtService;

    @Override
    public ResponseEntity<UserLoginResponseDto> userLogin(HttpSession session) {
        String userId = (String) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserLoginResponseDto userLoginResponseDto = new UserLoginResponseDto();
        userLoginResponseDto.setRole(user.getRole());
        return new ResponseEntity<>(userLoginResponseDto,HttpStatus.OK);
    }

    // @Override
    // public ResponseEntity<UserLoginResponseDto> userLogin(String microsoftId){
        
    //     User user = userRepository.findByMicrosoftId(microsoftId).orElseThrow(() -> new UsernameNotFoundException("No user found"));
        
    //     UserLoginResponseDto userLoginResponseDto = new UserLoginResponseDto();

    //     // String jwt = jwtService.generateToken(user);
    //     // userLoginResponseDto.setJwt(jwt);
    //     userLoginResponseDto.setRole(user.getRole());
    //     return new ResponseEntity<>(userLoginResponseDto,HttpStatus.OK);
    // }
    
}
