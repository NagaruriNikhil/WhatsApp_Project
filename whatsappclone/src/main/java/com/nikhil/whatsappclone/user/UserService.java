package com.nikhil.whatsappclone.user;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;


    public List<UserResponse> getAllUsersExceptSelf(Authentication connectedUser){
        return userRepository.findAllUsersExceptSelf(connectedUser.getName())
                .stream()
                .map(userMapper::toUserResponse)
                .toList();
    }

    public User getUserByPublicId(String publicId){
        return userRepository.findByPublicId(publicId)
                .orElseThrow(()-> new EntityNotFoundException("user with id "+publicId+" not found"));
    }
}
