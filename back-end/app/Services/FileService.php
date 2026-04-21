<?php

namespace App\Services;

use Illuminate\Container\Attributes\Storage as AttributesStorage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class FileService
{
    /**
     * Upload a file and return the stored path.
     *
     * @param UploadedFile $file The uploaded file instance
     * @param string $directory Directory relative to disk root (e.g., 'courses/thumbnails')
     * @param string $disk Storage disk name ('public' or 'local')
     * @return string|null The stored file path or null on failure
     */
    public function upload(UploadedFile $file, string $directory, string $disk = 'public'): ?string
    {
        if (!$file->isValid()) {
            return null;
        }

        // Generate unique filename to prevent conflicts
        $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();

        // Store file and get path
        $path = $file->storeAs($directory, $filename, $disk);

        return $path;
    }

    /**
     * Delete a file from storage.
     *
     * @param string|null $path File path relative to disk root
     * @param string $disk Storage disk name ('public' or 'local')
     * @return bool True if deleted, false otherwise
     */
    public function delete(?string $path, string $disk = 'public'): bool
    {
        if (empty($path)) {
            return false;
        }

        return Storage::disk($disk)->delete($path);
    }

    /**
     * Replace an existing file with a new one.
     *
     * @param UploadedFile $newFile New file to upload
     * @param string|null $oldPath Old file path to delete
     * @param string $directory Directory for new file
     * @param string $disk Storage disk name
     * @return string|null New file path or null on failure
     */
    public function replace(UploadedFile $newFile, ?string $oldPath, string $directory, string $disk = 'public'): ?string
    {
        // Delete old file if exists
        $this->delete($oldPath, $disk);

        // Upload new file
        return $this->upload($newFile, $directory, $disk);
    }

    /**
     * Get the public URL for a file (only works for 'public' disk with storage link).
     *
     * @param string|null $path File path relative to disk root
     * @param string $disk Storage disk name
     * @return string|null Public URL or null if path is empty
     */
    public function getUrl(?string $path, string $disk = 'public'): ?string
    {
        if (empty($path)) {
            return null;
        }

        return Storage::disk($disk)->url($path);
    }

    /**
     * Get file contents for streaming (useful for private files).
     *
     * @param string $path File path relative to disk root
     * @param string $disk Storage disk name
     * @return string|false File contents or false on failure
     */
    public function getContents(string $path, string $disk = 'local'): string|false
    {
        return Storage::disk($disk)->get($path);
    }

    /**
     * Check if a file exists.
     *
     * @param string|null $path File path relative to disk root
     * @param string $disk Storage disk name
     * @return bool
     */
    public function exists(?string $path, string $disk = 'public'): bool
    {
        if (empty($path)) {
            return false;
        }

        return Storage::disk($disk)->exists($path);
    }
}
