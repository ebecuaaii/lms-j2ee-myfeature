package com.lms.lms.controller;

import com.lms.lms.dto.response.ApiResponse;
import com.lms.lms.dto.response.UserProfileResponse;
import com.lms.lms.service.UserService;
import com.lms.lms.utils.ApiResponseUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ApiResponse<UserProfileResponse> getMyProfile(Authentication authentication) {
        String userId = authentication.getName();
        return ApiResponseUtil.success(userService.getMyProfile(userId));
    }
}