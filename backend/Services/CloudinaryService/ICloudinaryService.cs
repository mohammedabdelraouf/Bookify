namespace backend.Services.CloudinaryService
{
    public interface ICloudinaryService
    {
        Task<(string url, string publicId)> UploadImageAsync(IFormFile file, string folder = null);
        Task<bool> DeleteImageAsync(string publicId);

    }
}
