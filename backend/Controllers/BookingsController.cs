using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class BookingsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
