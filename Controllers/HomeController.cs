using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using OpenAI_GPT.Models;

namespace OpenAI_GPT.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    public HomeController(ILogger<HomeController> logger)
    {
        _logger = logger;
    }

    public IActionResult Index(string mode = "normal")
    {
        ViewBag.Mode = mode;
        return View();
    }
    // add the below action
    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
