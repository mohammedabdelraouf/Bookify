using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    public class AccountsController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
