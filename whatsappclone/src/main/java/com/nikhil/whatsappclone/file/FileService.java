package com.nikhil.whatsappclone.file;

import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static java.io.File.separator;
import static java.lang.System.currentTimeMillis;

@Service
@Slf4j
@RequiredArgsConstructor
public class FileService {


    @Value("${application.file.uploads.media-output-path}")
    private String fileUploadPath;

    public String saveFile(@NonNull MultipartFile file, @NonNull String userId) {
        final String fileUploadSubPath = "users" + separator + userId;

        return uploadFile(file, fileUploadSubPath);
    }

    public String uploadFile(@NonNull MultipartFile sourceFile,
                             @NonNull String fileUploadSubPath) {
        final String finalUploadPath = fileUploadPath + separator + fileUploadSubPath;
        File targetFolder = new File(finalUploadPath);

        if (!targetFolder.exists()) {
            boolean folderCreated = targetFolder.mkdirs();
            if (!folderCreated) {
                log.warn("Failed to create the target folder, {}", targetFolder);
                return null;
            }
        }
        final String fileExtension = getFileExtension(sourceFile.getOriginalFilename());
        String targetFinalPath = finalUploadPath + separator + currentTimeMillis() + fileExtension;
        Path targetPath = Paths.get(targetFinalPath);
        try {
            Files.write(targetPath, sourceFile.getBytes());
            log.info("File saved to {}",targetPath);
            return targetFinalPath;
        } catch (IOException e) {
            log.error("File was not saved", e);
        }
        return null;
    }

    private String getFileExtension(String filename) {
        if (filename == null || filename.isEmpty()) {
            return "";
        }
        int lastDotIndex = filename.lastIndexOf('.');
        if (lastDotIndex == -1) {
            return "";
        }

        return filename.substring(lastDotIndex + 1).toLowerCase();
    }
}
