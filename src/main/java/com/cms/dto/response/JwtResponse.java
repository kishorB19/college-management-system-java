package com.cms.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JwtResponse {
    private String accessToken;
    @Builder.Default
    private String tokenType = "Bearer";
    private Long userId;
    private Long profileId;
    private Long studentId;
    private Long teacherId;
    private String username;
    private String email;
    private String fullName;
    private String role;
    private String department;
    private String semester;
}
