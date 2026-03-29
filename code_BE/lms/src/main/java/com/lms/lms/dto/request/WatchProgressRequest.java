package com.lms.lms.dto.request;

import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class WatchProgressRequest {

    @Min(value = 0, message = "lastWatchedSecond must be >= 0")
    private int lastWatchedSecond;
}
