using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class ReviewsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
