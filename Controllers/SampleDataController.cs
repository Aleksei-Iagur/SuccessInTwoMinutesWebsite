using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace SuccessInTwoMinutes.Controllers
{
	[Route("api/[controller]/[action]")]
    public class SampleDataController : Controller
    {
		private static List<SuccessRecord> _successRecords = new List<SuccessRecord>();

		public SampleDataController()
		{
			var rng = new Random();
			for (var i = 0; i < 100; i++)
			{
				_successRecords.Add(
					new SuccessRecord
					{
						DateFormatted = DateTime.Now.AddDays(-50 + i).ToString("d"),
						SuccessText = Summaries[rng.Next(Summaries.Length)]
					});
			}
		}

        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

		[HttpGet]
		public IEnumerable<WeatherForecast> WeatherForecasts(int startDateIndex)
		{
			var rng = new Random();
			return Enumerable.Range(1, 5).Select(index => new WeatherForecast
			{
				DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
				TemperatureC = rng.Next(-20, 55),
				Summary = Summaries[rng.Next(Summaries.Length)]
			});
		}

		[HttpGet]
		public IEnumerable<SuccessRecord> SuccessRecords(int startDateIndex)
		{
			var result = _successRecords.Where(x => GoodDate(startDateIndex, x));
			return result;
		}

		[HttpPost]
		public IActionResult AddSuccessRecord([FromBody]SuccessRecord success)
		{
			_successRecords.Add(success);
			return StatusCode(200);
		}

		private static bool GoodDate(int startDateIndex, SuccessRecord x)
		{
			return DateTime.Parse(x.DateFormatted) > DateTime.Now.AddDays(startDateIndex) && DateTime.Parse(x.DateFormatted) < DateTime.Now.AddDays(5 + startDateIndex);
		}

		public class WeatherForecast
        {
            public string DateFormatted { get; set; }
            public int TemperatureC { get; set; }
            public string Summary { get; set; }

            public int TemperatureF
            {
                get
                {
                    return 32 + (int)(TemperatureC / 0.5556);
                }
            }
        }
    }

	public class SuccessRecord
	{
		public string DateFormatted { get; set; }

		public string SuccessText { get; set; }
	}
}
