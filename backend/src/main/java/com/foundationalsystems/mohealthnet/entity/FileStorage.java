package com.foundationalsystems.mohealthnet.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "File_Storage")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileStorage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "file_name", length = 255)
    private String fileName;

    @Lob
    @Column(name = "data")
    private byte[] data;
}