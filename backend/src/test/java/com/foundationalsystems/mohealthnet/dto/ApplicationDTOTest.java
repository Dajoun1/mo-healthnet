package com.foundationalsystems.mohealthnet.dto;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class ApplicationDTOTest {

    private ApplicationDTO activityDTO;

    @BeforeEach
    void setUp() {
        activityDTO = new ApplicationDTO.ActivityDTO();
    }

    @Test
    void setAndGetId() {
        activityDTO.setId(1);
        assertThat(activityDTO.getId()).isEqualTo(1);
    }

    }
