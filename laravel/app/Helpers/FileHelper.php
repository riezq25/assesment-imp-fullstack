<?php

namespace App\Helpers;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileHelper
{
    public static function uploadFile(string $folder, UploadedFile $file, ?callable $formatName = null): FileInfo
    {
        $extension = $file->getClientOriginalExtension();
        $size = $file->getSize();

        $name = Str::random(25);
        if ($formatName) {
            $name = $formatName($file);
        }

        $name = $name.'.'.$extension;

        $path = $file->storeAs($folder, $name);

        return new FileInfo(
            name: $name,
            path: $path,
            extension: $extension,
            size: $size
        );
    }

    public static function deleteFile(string $file): void
    {
        Storage::delete($file);
    }

    public static function updateFile(string $folder, ?string $oldFile, UploadedFile $newFile, ?callable $formatName = null): FileInfo
    {
        if (! is_null($oldFile)) {
            self::deleteFile($oldFile);
        }

        return self::uploadFile($folder, $newFile, $formatName);
    }

    public static function getFile(string $file): ?string
    {
        return Storage::exists($file) ? Storage::get($file) : null;
    }

    public static function getPublicUrl(string $file): string
    {
        return Storage::url($file);
    }

    public static function getTempUrl(?string $file): ?string
    {
        if (is_null($file)) {
            return null;
        }

        try {
            $driver = config('filesystems.default');
            if ($driver === 's3' || $driver === 'minio' || $driver === 'local') {
                return Storage::temporaryUrl($file, now()->addMinutes(5));
            }

            if ($driver === 'public') {
                return Storage::url($file);
            }

            return null;
        } catch (\Exception $e) {
            return null;
        }
    }

    public static function downloadFile(string $file): void
    {
        if (is_null($file)) {
            return;
        }
        Storage::download($file);
    }
}

class FileInfo
{
    public string $url;

    public function __construct(
        public string $name,
        public string $path,
        public string $extension,
        public int $size
    ) {
        $this->url = FileHelper::getPublicUrl($path);
    }
}
