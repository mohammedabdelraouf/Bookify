using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class RoomsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
