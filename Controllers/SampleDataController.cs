using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;

namespace SuccessInTwoMinutes.Controllers
{
	[Route("api/[controller]")]
    public class SampleDataController : Controller
    {
        private static string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

		[HttpGet("[action]")]
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

		[HttpGet("[action]")]
		public IEnumerable<SuccessRecord> SuccessRecords(int startDateIndex)
		{
			var rng = new Random();
			return Enumerable.Range(1, 5).Select(index => new SuccessRecord
			{
				DateFormatted = DateTime.Now.AddDays(index + startDateIndex).ToString("d"),
				SuccessText = Summaries[rng.Next(Summaries.Length)]
			});
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
